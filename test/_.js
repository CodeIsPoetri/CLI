'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.use(require('chai-as-promised'));

global.expect = chai.expect;
global.Agent = require('supertest-as-promised');
