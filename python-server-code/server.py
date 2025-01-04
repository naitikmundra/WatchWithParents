from flask import Flask, jsonify,request
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
#HERE MONGO CLOUD ATLAS DB IS USED
uri = "mongodb+srv://usernameandpassword@dblink.mongodb.net/?retryWrites=true&w=majority&appName=clustername"
# USERNAME AND PASSWORD REMOVED FOR HACKATHON PURPOSES
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['db']  
collection = db['collection']  

app = Flask(__name__)
CORS(app) 

@app.route('/search-by-url', methods=['POST'])
def search_by_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "URL not provided"}), 400

    url = data['url']
    document = collection.find_one({"f": url}, {'_id': 0}) 

    if document:
        return jsonify(document) 
    else:
        return jsonify({"error": "No document found for the given URL"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
