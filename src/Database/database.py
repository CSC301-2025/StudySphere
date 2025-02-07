from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from pathlib import Path
from dotenv import load_dotenv


# This gets the absolute path to the directory containing database.py
CURRENT_FILE = Path(__file__).resolve()
# .parent goes up one level -> "Database" folder
# .parent again goes up another level -> "src" folder
# .parent once more -> "my_project" folder
PROJECT_ROOT = CURRENT_FILE.parent.parent.parent  
# Now append ".env" to get the full path
env_path = PROJECT_ROOT / ".env"

# Load .env from that absolute path
load_dotenv(dotenv_path=env_path)

# Load variables from .env into environment
load_dotenv(dotenv_path="../.env")

db_user = os.getenv("DB_USERNAME")
db_pass = os.getenv("DB_PASSWORD")
print(f"\n\nVariables from .env file:\nUsername: {db_user} Password{db_pass}\n\n")

uri = f"mongodb+srv://{db_user}:{db_pass}@dev-cluster.63onr.mongodb.net/?retryWrites=true&w=majority&appName=dev-cluster"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Choose database
db = client["dev_database"]

# Reference "users" collection
users = db["users"]

# Reference "tutors" collection
tutors = db["tutors"]

# Reference "reviews" collection
reviews = db["reviews"]

# Reference "listings" collection
listings = db["listings"]

# Reference "universities" collection
universities = db["universities"]

# Reference "courses" collection
courses = db["courses"]


def add_user_db(userID: int, first_name : str, last_name : str, email: str, password: str, coursesIDs: list[int], description: str, reviewsIDs: list[int], universityID: int) -> bool:
    result = users.insert_one({"userID": userID, "first_name" : first_name, "last_name" : last_name, "email": email, "password": password, "coursesIDs": coursesIDs, "description": description, "reviewsIDs": reviewsIDs, "universityID": universityID})
    return result


def remove_user_db(userID: int, password: str) -> bool:
    result = users.delete_one({"userID": userID, "password": password})
    return result


def update_user_db(userID: int, first_name : str = None, last_name : str = None, email: str = None, password: str = None, coursesIDs: list[int] = None, description: str = None, reviewsIDs: list[int] = None, universityID: int = None) -> bool:
    changes = {}
    
    if first_name is not None:
        changes["first_name"] = first_name

    if last_name is not None:
        changes["last_name"] = last_name

    if email is not None:
        changes["email"] = email

    if password is not None:
        changes["password"] = password

    if coursesIDs is not None:
        changes["coursesIDs"] = coursesIDs

    if description is not None:
        changes["description"] = description

    if reviewsIDs is not None:
        changes["reviewsIDs"] = reviewsIDs

    if universityID is not None:
        changes["universityID"] = universityID

    result = users.update_one(
    {"userID": userID},
    {"$set": changes}
    )

    return result


def get_user_db(userID: int):
    result = users.find_one({"userID": userID})
    result.pop('_id', None)
    return result


def add_tutor_db(tutorID: int, first_name : str, last_name : str, email: str, password: str, coursesIDs: list[int], description: str, reviewsIDs: list[int], universityID: int, listingsIDs: list[int] = []) -> bool:
    result = tutors.insert_one({"tutorID": tutorID, "first_name" : first_name, "last_name" : last_name, "email": email, "password": password, "coursesIDs": coursesIDs, "description": description, "reviewsIDs": reviewsIDs, "universityID": universityID, "listingsIDs": listingsIDs})
    return result


def remove_tutor_db(tutorID: int, password: str):
    result = tutors.delete_one({"tutorID": tutorID, "password": password})
    return result


def update_tutor_db(tutorID: int, first_name : str = None, last_name : str = None, email: str = None, password: str = None, coursesIDs: list[int] = None, description: str = None, reviewsIDs: list[int] = None, universityID: int = None, listingsIDs: list[int] = None) -> bool:
    changes = {}
    
    if first_name is not None:
        changes["first_name"] = first_name

    if last_name is not None:
        changes["last_name"] = last_name

    if email is not None:
        changes["email"] = email

    if password is not None:
        changes["password"] = password

    if coursesIDs is not None:
        changes["coursesIDs"] = coursesIDs

    if description is not None:
        changes["description"] = description

    if reviewsIDs is not None:
        changes["reviewsIDs"] = reviewsIDs

    if universityID is not None:
        changes["universityID"] = universityID

    if listingsIDs is not None:
        changes["listingsIDs"] = listingsIDs

    result = tutors.update_one(
    {"userID": tutorID},
    {"$set": changes}
    )

    return result



def get_tutor_db(tutorID: int):
    result = tutors.find_one({"tutorID": tutorID})
    result.pop('_id', None)
    return result


def add_review_db(reviewID: int, userID: int, tutorID: int, rating: float, description: str):
    result = reviews.insert_one({"reviewID": reviewID, "userID": userID, "tutorID": tutorID, "rating": rating, "description": description})

    user_result = update_user_db(userID, reviewsIDs=get_user_db(userID)["reviewsIDs"].append[reviewID])
    tutor_result = update_tutor_db(tutorID, reviewsIDs=get_tutor_db(tutorID)["reviewsIDs"].append[reviewID])

    return result and user_result and tutor_result


def remove_review_db(reviewID: int):
    userID = get_review_db(reviewID)["userID"]
    tutorID = get_review_db(reviewID)["tutorID"]
    
    user_result = update_user_db(userID, reviewsIDs=get_user_db(userID)["reviewsIDs"].remove[userID])
    tutor_result = update_tutor_db(tutorID, reviewsIDs=get_tutor_db(tutorID)["reviewsIDs"].remove[reviewID])

    result = reviews.delete_one({"reviewID": reviewID})

    return result and user_result and tutor_result


def update_review_db(reviewID: int, userID: int, tutorID: int, rating: float, description: str) -> bool:
    changes = {}
    
    if userID is not None:
        changes["userID"] = userID

    if tutorID is not None:
        changes["tutorID"] = tutorID

    if rating is not None:
        changes["rating"] = rating

    if description is not None:
        changes["description"] = description

    result = reviews.update_one(
    {"reviewID": reviewID},
    {"$set": changes}
    )

    return result


def get_review_db(reviewID: int):
    result = reviews.find_one({"reviewID": reviewID})
    result.pop('_id', None)
    return result


def add_listing_db(listingID: int, tutorID: int, courseID: float, description: str):
    result = listings.insert_one({"listingID": listingID, "tutorID": tutorID, "courseID": courseID, "description": description})

    tutor_result = update_tutor_db(tutorID, listingsIDs=get_tutor_db(tutorID)["listingsIDs"].append[listingID])

    return result and tutor_result


def remove_listing_db(listingID: int):
    tutorID = get_listing_db(listingID)["tutorID"]
    
    tutor_result = update_tutor_db(tutorID, reviewsIDs=get_tutor_db(tutorID)["listingsIDs"].remove[listingID])

    result = listings.delete_one({"listingID": listingID})

    return result and tutor_result


def update_listing_db(listingID: int, tutorID: int = None, description: str = None) -> bool:
    changes = {}
    
    if tutorID is not None:
        changes["tutorID"] = tutorID

    if description is not None:
        changes["description"] = description

    result = listings.update_one(
    {"reviewID": listingID},
    {"$set": changes}
    )

    return result


def get_listing_db(listingID: int):
    result = listings.find_one({"listingID": listingID})
    result.pop('_id', None)
    return result


def add_university_db(universityID: int, coursesIDs: list[int]):
    result = universities.insert_one({"universityID": universityID, "coursesIDs": coursesIDs,})

    return result


def remove_university_db(universityID: int):
    result = universities.delete_one({"universityID": universityID})

    return result


def update_university_db(universityID: int, coursesIDs: list[int] = None) -> bool:
    changes = {}
    
    if coursesIDs is not None:
        changes["coursesIDs"] = coursesIDs

    result = universities.update_one(
    {"universityID": universityID},
    {"$set": changes}
    )

    return result


def get_university_db(universityID: int):
    result = universities.find_one({"universityID": universityID})
    result.pop('_id', None)
    return result


def add_course_db(courseID: int, universityID: int, title: str, code: str, description: str):
    result = courses.insert_one({"courseID": courseID, "universityID": universityID, "title": title, "code": code, "description": description})

    university_result = update_university_db(universityID, coursesIDs=get_university_db(universityID)["coursesIDs"].append[courseID])

    return result and university_result


def remove_course_db(courseID: int):
    universityID = get_course_db(courseID)["universityID"]
    
    university_result = update_university_db(universityID, coursesIDs=get_university_db(universityID)["coursesIDs"].remove[courseID])

    result = courses.delete_one({"courseID": courseID})

    return result and university_result


def update_course_db(courseID: int, universityID: int = None, title: str = None, code: str = None, description: str = None) -> bool:
    changes = {}
    
    if universityID is not None:
        changes["universityID"] = universityID

    if title is not None:
        changes["title"] = title

    if code is not None:
        changes["code"] = code

    if description is not None:
        changes["description"] = description

    result = courses.update_one(
    {"courseID": courseID},
    {"$set": changes}
    )

    return result


def get_course_db(courseID: int):
    result = courses.find_one({"courseID": courseID})
    result.pop('_id', None)
    return result



# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)