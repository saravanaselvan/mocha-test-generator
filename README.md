**DISCLAIMER:** This Extension is for a personal project. Please use it only if your express js controller follows the given pattern.

This Extension is to create mocha test skeleton from express js written with typescript.

It is helpful to generate mocha tests for express js controllers with the following pattern:

```
export class YourController {
    public static route = '/rootRoute';
    public router: Router = Router();

    constructor() {
        this.router.get('/persons', this.getPersons);
    }
}
```
There are two options available:

**Generate Mocha Test:**

This will generate a mocha test for the currently opened file and save it inside test folder.

``` Ctrl + Shift + P -> Generate Mocha Test```

**Generate Mocha For All Files:**

This generates tests for all the files in the current folder. Please use it with care. This will override already written tests inside test folder.

``` Ctrl + Shift + P -> Generate Mocha For All Files```