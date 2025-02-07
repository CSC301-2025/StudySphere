
from flask import Flask, request
import json
from database import *

app = Flask(__name__)
port = 8080

@app.route('/')
def db_running():
    return f'Hello, Flask MongoDB Database is running on http://127.0.0.1:{port}!'

@app.route('/user/add', methods=['POST'])
def add_user():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'userID' not in data:
        return {"error": "Missing userID"}
    
    if 'first_name' not in data:
        return {"error": "Missing first_name"}
    
    if 'last_name' not in data:
        return {"error": "Missing last_name"}
    
    if 'email' not in data:
        return {"error": "Missing email"}
    
    if 'password' not in data:
        return {"error": "Missing password"}
    
    if 'coursesIDs' not in data:
        return {"error": "Missing coursesIDs"}
    
    if 'description' not in data:
        return {"error": "Missing description"}
    
    if 'reviewsIDs' not in data:
        return {"error": "Missing reviewsIDs"}
    
    if 'universityID' not in data:
        return {"error": "Missing universityID"}

    userID = data['userID']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    password = data['password']
    coursesIDs = data['coursesIDs']
    description = data['description']
    reviewsIDs = data['reviewsIDs']
    universityID = data['universityID']

    add_user_db(userID, first_name, last_name, email, password, coursesIDs, description, reviewsIDs, universityID)
    return {"message": "Successfully added user"}


@app.route('/user/remove', methods=['POST'])
def remove_user():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'userID' not in data:
        return {"error": "Missing userID"}
    
    if 'password' not in data:
        return {"error": "Missing password"}

    userID = data['userID']
    password = data['password']

    remove_user_db(userID, password)
    return {"message": "Successfully removed user"}


@app.route('/user/update', methods=['POST'])
def update_user():
    data = request.get_json(silent=True)  # returns None if parsing fails

    userID = data['userID']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    password = data['password']
    coursesIDs = data['coursesIDs']
    description = data['description']
    reviewsIDs = data['reviewsIDs']
    universityID = data['universityID']

    update_user_db(userID, first_name, last_name, email, password, coursesIDs, description, reviewsIDs, universityID)
    return {"message": "Successfully updated user"}


@app.route('/user/<int:userID>', methods=['GET'])
def get_user(userID):
    return get_user_db(userID)


@app.route('/tutor/add', methods=['POST'])
def add_tutor():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'tutorID' not in data:
        return {"error": "Missing tutorID"}
    
    if 'first_name' not in data:
        return {"error": "Missing first_name"}
    
    if 'last_name' not in data:
        return {"error": "Missing last_name"}
    
    if 'email' not in data:
        return {"error": "Missing email"}
    
    if 'password' not in data:
        return {"error": "Missing password"}
    
    if 'coursesIDs' not in data:
        return {"error": "Missing coursesIDs"}
    
    if 'description' not in data:
        return {"error": "Missing description"}
    
    if 'reviewsIDs' not in data:
        return {"error": "Missing reviewsIDs"}
    
    if 'universityID' not in data:
        return {"error": "Missing universityID"}
    
    if 'listingsIDs' not in data:
        return {'error': 'Missing listingsIDs'}

    tutorID = data['tutorID']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    password = data['password']
    coursesIDs = data['coursesIDs']
    description = data['description']
    reviewsIDs = data['reviewsIDs']
    universityID = data['universityID']

    add_tutor_db(tutorID, first_name, last_name, email, password, coursesIDs, description, reviewsIDs, universityID, listingsIDs)
    return {"message": "Successfully added tutor"}


@app.route('/tutor/remove', methods=['POST'])
def remove_tutor():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'tutorID' not in data:
        return {"error": "Missing tutorID"}
    
    if 'password' not in data:
        return {"error": "Missing password"}

    tutorID = data['tutorID']
    password = data['password']

    remove_tutor_db(tutorID, password)
    return {"message": "Successfully removed tutor"}


@app.route('/tutor/update', methods=['POST'])
def update_tutor():
    data = request.get_json(silent=True)  # returns None if parsing fails

    tutorID = data['tutorID']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    password = data['password']
    coursesIDs = data['coursesIDs']
    description = data['description']
    reviewsIDs = data['reviewsIDs']
    universityID = data['universityID']

    update_tutor_db(tutorID, first_name, last_name, email, password, coursesIDs, description, reviewsIDs, universityID)
    return {"message": "Successfully updated tutor"}


@app.route('/tutor/<int:tutorID>', methods=['GET'])
def get_tutor(tutorID):
    return get_tutor_db(tutorID)


@app.route('/university/add', methods=['POST'])
def add_university():
    data = request.get_json(silent=True)  # returns None if parsing fails

    universityID = data['universityID']
    coursesIDs = data['coursesIDs']

    add_university_db(universityID, coursesIDs)
    return {"message": "Successfully added university"}


@app.route('/university/remove', methods=['POST'])
def remove_university():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'universityID' not in data:
        return {"error": "Missing universityID"}

    universityID = data['universityID']

    remove_university_db(universityID)
    return {"message": "Successfully removed university"}


@app.route('/university/update', methods=['POST'])
def update_university():
    data = request.get_json(silent=True)  # returns None if parsing fails

    universityID = data['universityID']
    coursesIDs = data['coursesIDs']

    update_university_db(universityID, coursesIDs)
    return {"message": "Successfully updated university"}


@app.route('/university/<int:universityID>', methods=['GET'])
def get_university(universityID):
    return get_university_db(universityID)


@app.route('/course/add', methods=['POST'])
def add_course():
    data = request.get_json(silent=True)  # returns None if parsing fails

    courseID = data['courseID']
    universityID = data['universityID']
    title = data['title']
    code = data['code']
    description = data['description']

    add_course_db(courseID, universityID, title, code, description)
    return {"message": "Successfully added course"}


@app.route('/course/remove', methods=['POST'])
def remove_course():
    data = request.get_json(silent=True)  # returns None if parsing fails

    if 'courseID' not in data:
        return {"error": "Missing courseID"}

    courseID = data['courseID']

    remove_course_db(courseID)
    return {"message": "Successfully removed course"}


@app.route('/course/update', methods=['POST'])
def update_course():
    data = request.get_json(silent=True)  # returns None if parsing fails

    courseID = data['courseID']
    universityID = data['universityID']
    title = data['title']
    code = data['code']
    description = data['description']

    update_course_db(courseID, universityID, title, code, description)
    return {"message": "Successfully updated course"}


@app.route('/course/<int:courseID>', methods=['GET'])
def get_course(courseID):
    return get_course_db(courseID)


if __name__ == '__main__':
    app.run(port=port, debug=True)

