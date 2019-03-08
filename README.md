# RPC
Full Stack Application to Upload Documents, view and apply search on them using elasticsearch.
On uploading the document, document is stored in local system(I suggest to implement `AWS S3` on your own),<br /> It is then converted into text and uploaded to Elasticsearch in Bonsai Heroku. <br />
Those text can be searched and output result is displayed based on score.

```
Backend: Node 
Frontend: ejs template
Database: PostGres Heroku
ElasticSearch: Bonsai heroku
```

Also create your own `variables.js` file at `/` using these contents 
```
exports.upload_path = "Documents Download Path"
exports.bonsai_url    = "Bonsai URL";
exports.bonsai_index = "Bonsai Index";
exports.bonsai_type = "Bonsai Type"; 
```

Also create `knexfile.js` at `/` using these contents: <br />
```
module.exports = {
   development: {
    client: 'postgresql',
    connection: {
      host : 'AWS Host',
    	user : 'AWS User',
    	password : 'AWS Password',
    	database : 'AWS DB',
    	port: 5432,
    	ssl: true
    }
  },
    pool: {
      min: 2,
      max: 10
    }
}
```
