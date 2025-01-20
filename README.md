<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# URL Shortener Service

A URL shortening service built with NestJS framework.

## Description

This service provides API endpoints to create and resolve shortened URLs. It uses Redis for storing URL mappings.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
SERVICE_PORT=8080
API_VERSION=1
POSTMAN_CONFIG_ENABLED=true
ENABLE_DOCUMENTATION=true
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB_INDEX=1
SHORTEN_URL_KEY_PATTERN=shorten-url-
REDIS_TTL=15000        # Time in seconds before URL expires
```

## Prerequisites

- Node.js (v14 or higher)
- Redis server running locally or remotely
- npm or yarn package manager

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### 1. Generate Short URL
- **Endpoint**: POST `/get-smlink`
- **Body**:
  ```json
  {
    "original_url": "https://example.com/very-long-url",
    "expires_in": 3600  // optional, defaults to REDIS_TTL
  }
  ```
- **Response**:
  ```json
  {
    "shortUrl": "http://your-domain/abc123"
  }
  ```

### 2. Get Original URL
- **Endpoint**: GET `/get-original-url/:smlink_key`
- **Response**: Original URL string

### 3. Redirect to Original URL
- **Endpoint**: GET `/:smlink`
- **Behavior**: Redirects to the original URL
- **Response**: 301 Redirect

### 4. Health Check
- **Endpoint**: GET `/health-check`
- **Response**: Service status message

## Error Responses

- **400**: Invalid URL or expired short link
- **500**: Internal server error

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [MIT licensed](LICENSE).
