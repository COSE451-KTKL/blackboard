import { spawn } from 'child_process';

export const postLogin = async (req, res) => {
    try {
        const { encId, encPw } = req.query; // get Id and Pw from url query

        if (!encId || !encPw) {
            return res.status(400).render("login", {
                pageTitle: "로그인",
                errorMessage: "ID와 비밀번호를 모두 제공해야 합니다. 다시 시도해주세요.",
            });
        }


        // give C file the encoded id&pw
        const cfileDirectory = path.join(__dirname, "src", "controllers", "Login.exe"); // C file directory
        //const child = spawn(cfileDirectory, [encId, encPw], {cwd: __dirname});
        try {
            await cFileController(cfileDirectory, [
                encId,
                encPw,
            ]);
            console.log("complete");
        } catch (error) {
            console.error('C program execution error:', error);
        }

        let cFileOutput = '';

        child.stdout.on('data', (data) => {
            cFileOutput += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                // C file succeed and handle cFileOutput here
                console.log('C program output:', cFileOutput);
                //get the id&pw
                const [decryptedId, decryptedPw] = cFileOutput.split(' ');
            } else {
                res.status(500).render("login", {
                    pageTitle: "에러",
                    errorMessage: "C wrong!",
                });
            }
        });
    } catch (errorMessage) {
        return res.status(400).render("login", {
            pageTitle: "에러",
            errorMessage,
        });
    }
};