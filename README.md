# COSE451 소프트웨어보안

## Member

- **김백규**  
   [![GitHub Badge](https://img.shields.io/badge/GitHub-181717?&logo=GitHub&logoColor=white&style=for-the-badge&link=https://github.com/centneuf0109)](https://github.com/centneuf0109)
- **이혁준**  
   [![GitHub Badge](https://img.shields.io/badge/GitHub-181717?&logo=GitHub&logoColor=white&style=for-the-badge&link=https://github.com/newxxson)](https://github.com/newxxson)
- **김한별**  
   [![GitHub Badge](https://img.shields.io/badge/GitHub-181717?&logo=GitHub&logoColor=white&style=for-the-badge&link=https://github.com/khan1652)](https://github.com/khan1652)
- **Tang Siqi**  
   [![GitHub Badge](https://img.shields.io/badge/GitHub-181717?&logo=GitHub&logoColor=white&style=for-the-badge&link=https://github.com/NinaT926)](https://github.com/NinaT926)

## 커밋 규칙

커밋 메세지는 다음과 같은 형식으로 작성합니다.

```
Activity: Commit Message
```

- Activities
  - `int`: only for initial commit
  - `doc`: changes document or comment
  - `ftr`: add new feature
  - `mod`: modify existing feature
  - `fix`: fix an error or issue
  - `rfc`: refactor code
  - `add`: add new file or directory
  - `rmv`: remove existing file or directory
- Example
  - `int: initial commit`
  - `add: prettier and eslint`
  - `rfc: refactoring code by prettier`

## FOR THE GITCTF BUILD GUIDE

1. download docker file

   ```
   https://drive.google.com/file/d/1JF4eGDw_G-5KKrJGdCcRHHbKz6Jy-lhV/view?usp=drive_link
   ```

2. docker image build
   ```
   docker build -t ktkl:2.0 .
   ```
3. run docker container

   ```
   docker run -p 4000:4000 -d --name ktkl_container ktkl:2.0
   ```

4. open localhost:4000/ => our homepage
