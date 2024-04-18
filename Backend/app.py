from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash,generate_password_hash
import jwt
import datetime
from sqlalchemy.orm import joinedload
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/community_chat'
app.config['SECRET_KEY'] = 'your_secret_key' 
db = SQLAlchemy(app)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = generate_password_hash(password) 
    

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    post = db.relationship('Post', backref=db.backref('likes', lazy=True))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('likes', lazy=True))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    @property
    def username(self):
        return self.user.name if self.user else None

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    @property
    def username(self):
        return self.user.name if self.user else None



@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User signed up successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Generate JWT token
        token = jwt.encode({'email': email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'user_id': user.id}), 200

    else:
        return jsonify({'message': 'Invalid email or password'}), 401


@app.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    user_id = data.get('user_id')
    content = data.get('content')

    new_post = Post(user_id=user_id, content=content)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully'}), 201



@app.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    result = []
    for post in posts:
        likes_count = Likes.query.filter_by(post_id=post.id).count()
        comments_count = Comment.query.filter_by(post_id=post.id).count()
        result.append({
            'id': post.id,
            'user_id': post.user_id,
            'username': post.username,
            'content': post.content,
            'created_at': post.created_at,
            'likes_count': likes_count,
            'comments_count': comments_count
        })
    return jsonify(result)


@app.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    return jsonify({
        'id': post.id,
        'user_id': post.user_id,
        'username': post.username,
        'content': post.content,
        'created_at': post.created_at
    })


@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    data = request.json
    post.content = data.get('content', post.content)
    db.session.commit()

    return jsonify({'message': 'Post updated successfully'})


@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    db.session.delete(post)
    db.session.commit()

    return jsonify({'message': 'Post deleted successfully'})

@app.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    data = request.json
    user_id = data.get('user_id')

    existing_like = Likes.query.filter_by(post_id=post_id, user_id=user_id).first()
    if existing_like:
        return jsonify({'message': 'You have already liked this post'}), 400

    new_like = Likes(post_id=post_id, user_id=user_id)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({'message': 'Post liked successfully'}), 201

@app.route('/posts/<int:post_id>/likes/count', methods=['GET'])
def count_likes(post_id):
    try:
        # Query the Likes table to count the number of likes for the given post_id
        likes_count = Likes.query.filter_by(post_id=post_id).count()
        return jsonify({'likes_count': likes_count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/posts/<int:post_id>/comments/count', methods=['GET'])
def count_comments(post_id):
    # Query the Comment table to count the number of comments for the given post_id
    comments_count = Comment.query.filter_by(post_id=post_id).count()
    return jsonify({'comments_count': comments_count})

@app.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    post = Post.query.get(post_id)

    if not post:
        return jsonify({'message': 'Post not found'}), 404

    comments = Comment.query.filter_by(post_id=post_id).all()
    comment_list = []
    for comment in comments:
        username = comment.user.name if comment.user else None
        comment_list.append({
            'id': comment.id,
            'user_id': comment.user_id,
            'username': username,
            'content': comment.content,
            'created_at': comment.created_at
        })
    return jsonify(comment_list)



@app.route('/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    data = request.json
    user_id = data.get('user_id')
    content = data.get('content')

    # Check if the post exists
    post = Post.query.get(post_id)
    if not post:
        return jsonify({'message': 'Post not found'}), 404

    # Create a new comment
    new_comment = Comment(user_id=user_id, post_id=post_id, content=content)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment created successfully'}), 201
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'created_at': user.created_at
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404
    
@app.route('/posts/<int:post_id>/like', methods=['DELETE'])
def unlike_post(post_id):
    data = request.json
    user_id = data.get('user_id')

    existing_like = Likes.query.filter_by(post_id=post_id, user_id=user_id).first()
    if not existing_like:
        return jsonify({'message': 'You have not liked this post yet'}), 400

    db.session.delete(existing_like)
    db.session.commit()

    return jsonify({'message': 'Post unliked successfully'}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='192.168.0.105', port=3000, debug=True)


