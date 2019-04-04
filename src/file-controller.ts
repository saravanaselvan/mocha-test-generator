import * as fs from 'fs';

export class FileController {

  private rootRouteContent = '';
  private importContent = `
import * as chai from 'chai';
import { Environment } from './../src/config/environment';
import { app } from './../src/main';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const route = `;
  private testContent = `

it('Invalid routing', async () => {
  console.log(process.env.OFLOW_ENV);
  try {
    const res = await chai.request(app).get(route + '/unknownrouting');
  } catch (err) {
    expect(err.status).to.equal(404);
  }
});
`;

  constructor(private currentDir: string) {

  }

  private createTestFile(testFileName: string, fileContent: string) {
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

  private buildGetTestContent(fileContent: string) {
    let getRoutePattern = /router\.get\(\'.*\'/ig;
    const getRoutes = fileContent.match(getRoutePattern) || [];
    let testContent = '';
    getRoutes.map((route) => {
      let testRoute = route.split('(')[1];
      testContent += this.populateGetTestConent(testRoute);
    });
    return testContent;
  }

  private buildPutTestContent(fileContent: string) {
    let putRoutePattern = /router\.put\(\'.*\'/ig;
    const putRoutes = fileContent.match(putRoutePattern) || [];
    let testContent = '';
    putRoutes.map((route) => {
      let testRoute = route.split('(')[1];
      testContent += this.populatePutTestContent(testRoute);
    });
    return testContent;
  }

  private buildPostTestContent(fileContent: string) {
    let postRoutePattern = /router\.post\(\'.*\'/ig;
    const postRoutes = fileContent.match(postRoutePattern) || [];
    let testContent = '';
    postRoutes.map((route) => {
      let testRoute = route.split('(')[1];
      testContent += this.populatePostTestContent(testRoute);
    });
    return testContent;
  }

  private buildDeleteTestContent(fileContent: string) {
    let deleteRoutePattern = /router\.delete\(\'.*\'/ig;
    const deleteRoutes = fileContent.match(deleteRoutePattern) || [];
    let testContent = '';
    deleteRoutes.map((route) => {
      let testRoute = route.split('(')[1];
      testContent += this.populateDeleteTestContent(testRoute);
    });
    return testContent;
  }
  private populateGetTestConent(route: string) {
    route = route.replace(/\'/g, '');
    let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
    if (route.split('/').filter(Boolean).length === 0) {
      route = rootRoute;
    } else {
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

  private populatePutTestContent(route: string) {
    route = route.replace(/\'/g, '');
    let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
    if (route.split('/').filter(Boolean).length === 0) {
      route = rootRoute;
    } else {
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

  private populatePostTestContent(route: string) {
    route = route.replace(/\'/g, '');
    let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
    if (route.split('/').filter(Boolean).length === 0) {
      route = rootRoute;
    } else {
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

  private populateDeleteTestContent(route: string) {
    route = route.replace(/\'/g, '');
    let rootRoute = this.rootRouteContent.slice(0, this.rootRouteContent.length - 1).replace(/\'/g, '');
    if (route.split('/').filter(Boolean).length === 0) {
      route = rootRoute;
    } else {
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