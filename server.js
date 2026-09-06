const express = require("express");
const path = require("path");

const app = express();


// ==========================================
// PORT
// ==========================================

const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// STATIC FILES
// ==========================================
// index.html
// marksheet.png
// CSS / JS / images
// are all inside the main project folder.

app.use(express.static(__dirname));


// ==========================================
// STUDENT DATA
// ==========================================

const studentData = {

    "1RV23CS001": {
        name: "PRATHAM N M",
        usn: "1RV23CS001",
        marksheet: "/marksheet.png"
    },

    "1RV23CS002": {
        name: "RAHUL KUMAR",
        usn: "1RV23CS002",
        marksheet: "/marksheet.png"
    },

    "1RV23CS003": {
        name: "ANANYA SHARMA",
        usn: "1RV23CS003",
        marksheet: "/marksheet.png"
    }

};


// ==========================================
// CAPTCHA
// ==========================================

function generateCaptcha() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let captcha = "";

    for (let i = 0; i < 5; i++) {

        const randomIndex = Math.floor(
            Math.random() * characters.length
        );

        captcha += characters[randomIndex];

    }

    return captcha;
}


// Current CAPTCHA
let currentCaptcha = generateCaptcha();


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// ==========================================
// RESULT PAGE
// ==========================================

app.get(
    "/vtu-4thsemesterresults-may-june-2026",
    (req, res) => {

        res.sendFile(
            path.join(__dirname, "index.html")
        );

    }
);


// ==========================================
// GET NEW CAPTCHA
// ==========================================

app.get("/api/captcha", (req, res) => {

    currentCaptcha = generateCaptcha();

    res.json({

        success: true,

        captcha: currentCaptcha

    });

});


// ==========================================
// VERIFY USN + CAPTCHA
// ==========================================

app.post("/api/verify", (req, res) => {

    const usn = String(
        req.body.usn || ""
    )
        .trim()
        .toUpperCase();


    const captcha = String(
        req.body.captcha || ""
    )
        .trim()
        .toUpperCase();


    // ------------------------------
    // Check empty fields
    // ------------------------------

    if (!usn || !captcha) {

        return res.status(400).json({

            success: false,

            message:
                "Please enter USN and CAPTCHA."

        });

    }


    // ------------------------------
    // Check CAPTCHA
    // ------------------------------

    if (captcha !== currentCaptcha) {

        // Generate a new CAPTCHA
        currentCaptcha = generateCaptcha();

        return res.status(400).json({

            success: false,

            message:
                "Invalid CAPTCHA.",

            captcha:
                currentCaptcha

        });

    }


    // ------------------------------
    // Find student
    // ------------------------------

    const student = studentData[usn];


    if (!student) {

        return res.status(404).json({

            success: false,

            message:
                "USN not found."

        });

    }


    // ------------------------------
    // Successful result
    // ------------------------------

    return res.json({

        success: true,

        message:
            "Result found successfully.",

        data: {

            name: student.name,

            usn: student.usn,

            marksheet: student.marksheet

        }

    });

});


// ==========================================
// GET STUDENT DETAILS
// ==========================================

app.get("/api/student/:usn", (req, res) => {

    const usn = String(
        req.params.usn || ""
    )
        .trim()
        .toUpperCase();


    const student = studentData[usn];


    if (!student) {

        return res.status(404).json({

            success: false,

            message:
                "Student not found."

        });

    }


    return res.json({

        success: true,

        data: {

            name: student.name,

            usn: student.usn,

            marksheet: student.marksheet

        }

    });

});


// ==========================================
// 404 PAGE
// ==========================================

app.use((req, res) => {

    res.status(404).send(`

        <!DOCTYPE html>

        <html>

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>Page Not Found</title>

        </head>

        <body style="
            margin: 0;
            padding: 50px 20px;
            font-family: Arial, sans-serif;
            text-align: center;
        ">

            <h1>404</h1>

            <p>
                The requested page was not found.
            </p>

            <a href="/">
                Go to Result Page
            </a>

        </body>

        </html>

    `);

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        `Local: http://localhost:${PORT}`
    );

    console.log(
        `Result: http://localhost:${PORT}/vtu-4thsemesterresults-may-june-2026`
    );

});
