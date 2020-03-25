# Clickjacking Tester

Clickjacking Tester, written in NodeJS, designed to check if the website is vulnerable to clickjacking and creates a POC. implementing the advantages of multi-threads in Node JS ( worker threads ) to improve the performance


### Usage

```
git clone https://github.com/abdurhasan/clickjacking-tester
cd clickjacking-tester
npm install
node index.js <file_name>
```

### Example

##### Input

```
node index.js sites.txt
```

##### sites.txt

```
www.google.com
www.turkhackteam.com
```

##### Output

```
[*] Checking www.google.com

 [-] Website is not vulnerable!

[*] Checking www.turkhackteam.org

 [+] Website is vulnerable!
 [*] Created a poc and saved to <URL>.html
```