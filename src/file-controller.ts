import * as fs from 'fs';
import * as path from 'path';

export class FileController {

  private rootRouteContent = '';
  private importContent = `
import * as chai from 'chai';
import { app } from './../src/main';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const route = `;
  private testContent = `

it('Invalid routing', async () => {
  try {
    const res = await chai.request(app).get(route + '/unknownrouting');
  } catch (err) {
    expect(err.status).to.equal(404);
  }
});
`;

  constructor(
    private currentDir: string,
    private currentFile: string) {

  }

  private createTestFile(testFileName: string, fileContent: string) {
    let rootRoutePattern = /\'\/\w*\';/ig;
    let rootRouteMatch = fileContent.match(rootRoutePattern) || [];
    this.rootRouteContent = rootRouteMatch[0];

    let httpMethodsTestContent = this.buildTestContent(fileContent);


    const fullTestContent = `${this.importContent}${this.rootRouteContent}${this.testContent}${httpMethodsTestContent}`;
    fs.writeFile(`${this.currentDir}/../../test/${testFileName}`, fullTestContent, function (err) { console.log(err); });
  }

  private buildTestContent(fileContent: string) {
    let httpMethods = [
      { method: 'Get', routePattern: /router\.get\(\'.*\'/ig },
      { method: 'Put', routePattern: /router\.put\(\'.*\'/ig },
      { method: 'Post', routePattern: /router\.post\(\'.*\'/ig }
    ];
    let testContent = '';
    let self = this;
    httpMethods.map((item) => {
      const routePattern = item.routePattern;
      const getRoutes = fileContent.match(routePattern) || [];
      getRoutes.map((route) => {
        let testRoute = route.split('(')[1];
        let populateMethod = `populate${item.method}TestContent`;
        testContent += (self as any)[populateMethod](testRoute);
      });
    });
    return testContent;
  }

  private populateGetTestContent(route: string) {
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
        let fileNameWithExtension = file.split('.');
        fileNameWithExtension.pop();
        let testFileName = `${fileNameWithExtension.join('.')}.test.ts`;
        fs.readFile(`${self.currentDir}/${file}`, 'utf8', function (err, fileContent) {
          self.createTestFile(testFileName, fileContent);
        });
      });
    });
  }

  generateSingleTest() {
    const self = this;
    let fileNameWithExtension = path.basename(this.currentFile).split('.');
    fileNameWithExtension.pop();
    let testFileName = `${fileNameWithExtension.join('.')}.test.ts`;
    fs.readFile(`${this.currentFile}`, 'utf8', function (err, fileContent) {
      self.createTestFile(testFileName, fileContent);
    });
  }
}