# Northcoders News API

NC News API is designed to serve as the backend for a news application, providing endpoints to manage articles, comments, topics, and users data efficiently. This project is built using Node.js, Express, and PostgreSQL, offering a RESTful API for various news-related functionalities, that is fully documented and tested.

## Features

- Topics: Fetch all news topics.
- Articles: Retrieve all articles, filter by topic, sort by various fields, and get individual articles by ID.
- Comments: Get comments for an article, post new comments, and delete comments by ID.
- Users: Get information about all users.

Here is the [live version](https://nc-news-back-end-l734.onrender.com/api) of the API.

## Requirements

- Node.js (minimum version 14.0.0)
- PostgreSQL (minimum version 12.0)

## Instructions

1. Clone the repository:
```bash
git clone https://github.com/Yana23-sys/nc-news-back-end.git
```
2. Install dependencies:
```bash
npm install
```
3. Set up the databases:

- You will need to create two `.env` files for this project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=`, with the correct database name for that environment:
```bash
PGDATABASE=your_database_name
```
4. Seed the local database:
```bash
npm run seed
```
5. Run the tests:
```bash
npm test
```

## API Endpoints

### GET /api/topics
- Description: Retrieves all topics.
- Response: An array of topic objects, each containing slug and description.
### GET /api
- Description: Provides a description of all available endpoints.
- Response: An object containing all available endpoints with their descriptions.
### GET /api/articles/:article_id
- Description: Retrieves an article by its ID.
- Response: An article object with properties: author, title, article_id, body, topic, created_at, votes, and article_img_url.
### GET /api/articles
- Description: Retrieves all articles.
- Response: An array of article objects, each with properties: author, title, article_id, topic, created_at, votes, article_img_url, and comment_count.
- Query Parameters:
    - topic: Filters articles by topic.
    - sort_by: Sorts articles by any valid column (defaults to created_at).
    - order: Sets the order to ascending or descending (defaults to desc).
### GET /api/articles/:article_id/comments
- Description: Retrieves all comments for a specific article.
- Response: An array of comment objects with properties such as comment_id, votes, created_at, author, body, and article_id.
### POST /api/articles/:article_id/comments
- Description: Adds a comment to an article.
- Request Body:
    - username: The username of the commenter.
    - body: The content of the comment.
- Response: The posted comment.
### PATCH /api/articles/:article_id
- Description: Updates an article's vote count by its ID.
- Request Body: An object in the form { inc_votes: newVote }.
- Response: The updated article.
### DELETE /api/comments/:comment_id
- Description: Deletes a comment by its ID.
- Response: Status 204 and no content.
### GET /api/users
- Description: Retrieves all users.
- Response: An array of user objects, each containing username, name, and avatar_url.

## Error Handling

The API includes comprehensive error handling for various scenarios, including invalid queries, non-existent resources, and database errors. Each endpoint has specific error tests to ensure reliable operation.

--- 
Special thanks to the Northcoders team for providing guidance and resources throughout the development of this project.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
