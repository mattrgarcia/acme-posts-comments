const pg = require('pg');
const { Client } = pg;

const uuid = require('uuid');

const client = new Client('postgres://localhost/acme_posts_db');

client.connect();

const nodeId = uuid.v4();
const reactId = uuid.v4();
const expressId = uuid.v4();


const SQL = `
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS posts;

  CREATE TABLE posts(
    id UUID PRIMARY KEY,
    topic VARCHAR(255)
  );
  CREATE TABLE tags(
    id SERIAL,
    text TEXT,
    post_id UUID REFERENCES posts(id)
  );
  INSERT INTO posts(id, topic) values('${nodeId}', 'Node');
  INSERT INTO posts(id, topic) values('${reactId}', 'React');
  INSERT INTO posts(id, topic) values('${expressId}', 'Express');
  INSERT INTO tags(text, post_id) values('Cool', '${nodeId}');
  INSERT INTO tags(text, post_id) values('Really Cool', '${reactId}');
  INSERT INTO tags(text, post_id) values('Really Really Cool', '${expressId}');


`
const syncAndSeed =  async()=> {
  await client.query(SQL);
};

const findAllPosts = async()=> {
  const response = await client.query('SELECT * FROM posts;');
  return response.rows
};
const findAllTags = async()=> {
  const response = await client.query('SELECT * FROM tags;');
  return response.rows
};

module.exports = {
  syncAndSeed,
  findAllPosts,
  findAllTags
}
