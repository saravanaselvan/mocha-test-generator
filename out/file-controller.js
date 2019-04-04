"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class FileController {
    constructor(currentDir) {
        this.currentDir = currentDir;
        this.rootRouteContent = '';
        this.importContent = `
import * as chai from 'chai';
import { Environment } from './../src/config/environment';
import { app } from './../src/main';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const route = `;
        this.testContent = `

it('Invalid routing', async () => {
  console.log(process.env.OFLOW_ENV);
  try {
    const res = await chai.request(app).get(route + '/unknownrouting');
  } catch (err) {
    expect(err.status).to.equal(404);
  }
});
`;
    }
    createTestFile(testFileName, fileContent) {
        let rootRoutePattern = /\'\/\w*\';/ig;
        let rootRouteMatch = fileContent.match(rootRoutePattern) || [];
        this.rootRouteContent = rootRouteMatch[0];
        let putContent = this.buildPutTestContent(fileContent);
        let getContent = this.buildGetTestContent(fileContent);
        let postContent = this.buildPostTestContent(fileContent);
        let deleteContent = this.buildDeleteTestContent(fileContent);
        const fullTestContent = `${this.importContent}${this.rootRouteContent}${this.testContent}${getContent}${putContent}${postContent}${deleteContent}`;
        fs.writeFile(`${this.currentDir}/../../test/${testFileName}`, fullTestContent, function (err) { console.log(err); });
    }
    buildGetTestContent(fileContent) {
        let getRoutePattern = /router\.get\(\'.*\'/ig;
        const getRoutes = fileContent.match(getRoutePattern) || [];
        let testContent = '';
        getRoutes.map((route) => {
            let testRoute = route.split('(')[1];
            testContent += this.populateGetTestConent(testRoute);
        });
        return testContent;
    }
    buildPutTestContent(fileContent) {
        let putRoutePattern = /router\.put\(\'.*\'/ig;
        const putRoutes = fileContent.match(putRoutePattern) || [];
        let testContent = '';
        putRoutes.map((route) => {
            let testRoute = route.split('(')[1];
            testContent += this.populatePutTestContent(testRoute);
        });
        return testContent;
    }
    buildPostTestContent(fileContent) {
        let postRoutePattern = /router\.post\(\'.*\'/ig;
        const postRoutes = fileContent.match(postRoutePattern) || [];
        let testContent = '';
        postRoutes.map((route) => {
            let testRoute = route.split('(')[1];
            testContent += this.populatePostTestContent(testRoute);
        });
        return testContent;
    }
    buildDeleteTestContent(fileContent) {
        let deleteRoutePattern = /router\.delete\(\'.*\'/ig;
        const deleteRoutes = fileContent.match(deleteRoutePattern) || [];
        let testContent = '';
        deleteRoutes.map((route) => {
            let testRoute = route.split('(')[1];
            testContent += this.populateDeleteTestContent(testRoute);
        });
        return testContent;
    }
    populateGetTestConent(route) {
        route = route.replace(/\'/g, '');
        let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
        if (route.split('/').filter(Boolean).length === 0) {
            route = rootRoute;
        }
        else {
            route = `${rootRoute}${route}`;
        }
        return `

it('${route}', async () => {
  try {
    const res = await chai.request(app).get('${route}');
    expect(res.status).to.equal(200);
  } catch (err) {
    expect(err.status).to.equal(400);
  }
});
`;
    }
    populatePutTestContent(route) {
        route = route.replace(/\'/g, '');
        let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
        if (route.split('/').filter(Boolean).length === 0) {
            route = rootRoute;
        }
        else {
            route = `${rootRoute}${route}`;
        }
        return `
it('${route}', async () => {
  try {
    const res = await chai.request(app).put('${route}')
      .send('data');
    expect(res.status).to.equal(200);
  } catch (err) {
    expect(err.status).to.equal(400);
  }
});
`;
    }
    populatePostTestContent(route) {
        route = route.replace(/\'/g, '');
        let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
        if (route.split('/').filter(Boolean).length === 0) {
            route = rootRoute;
        }
        else {
            route = `${rootRoute}${route}`;
        }
        return `
it('${route}', async () => {
  try {
    const res = await chai.request(app).post('${route}')
      .send('data');
    expect(res.status).to.equal(200);
  } catch (err) {
    expect(err.status).to.equal(400);
  }
});
`;
    }
    populateDeleteTestContent(route) {
        route = route.replace(/\'/g, '');
        let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
        if (route.split('/').filter(Boolean).length === 0) {
            route = rootRoute;
        }
        else {
            route = `${rootRoute}${route}`;
        }
        return `
it('${route}', async () => {
  try {
    const res = await chai.request(app).delete('${route}')
      .send('data');
    expect(res.status).to.equal(200);
  } catch (err) {
    expect(err.status).to.equal(400);
  }
});
`;
    }
    generateTests() {
        const self = this;
        fs.readdir(self.currentDir, function (err, files) {
            if (err) {
                console.log(err);
                return;
            }
            files.map((file) => {
                let testFileName = `${file.split('.')[0]}.test.ts`;
                fs.readFile(`${self.currentDir}/${file}`, 'utf8', function (err, fileContent) {
                    self.createTestFile(testFileName, fileContent);
                });
            });
        });
    }
}
exports.FileController = FileController;
//# sourceMappingURL=file-controller.js.map