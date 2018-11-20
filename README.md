# rpc
Full Stack Application to Upload Documents, view and apply search on them using elasticsearch.
On uploading the document, document is stored in local system(I suggest to implement AWS S3 on your own),<br /> It is then converted into text and uploaded to Elasticsearch in Bonsai Heroku. <br />
Those text can be searched and output result is displayed based on score.


Backend: Node <br />
Frontend: ejs template<br />
Database: PostGres Heroku<br />
ElasticSearch: Bonsai heroku<br />

Also create your own variables.js file with <br />
exports.upload_path = "Documents Download Path" <br />
exports.bonsai_url    = "Bonsai URL";<br />
 exports.bonsai_index = "Bonsai Index";<br />
exports.bonsai_type = "Bonsai Type"; <br />
