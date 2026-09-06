const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// ===============================
// Middleware
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));


// ===============================
// Student Data
// ===============================

const studentData = {

    '1RV23CS001': {
        name: 'PRATHAM N M',
        usn: '1RV23CS001',
        marksheet: 'https://raw.githubusercontent.com/Pratham0770-NM/marksheet-website/main/marksheet.png.png'
    },

    '1RV23CS002': {
        name: 'RAHUL KUMAR',
        usn: '1RV23CS002',
        marksheet: 'https://raw.githubusercontent.com/Pratham0770-NM/marksheet-website/main/marksheet.png.png'
    },

    '1RV23CS003': {
        name: 'ANANYA SHARMA',
        usn: '1RV23CS003',
        marksheet: 'https://raw.githubusercontent.com/Pratham0770-NM/marksheet-website/main/marksheet.png.png'
    }

};


// ===============================
// CAPTCHA
// ===============================

function generateCaptcha() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let captcha = "";

    for (let i = 0; i < 5; i++) {

        captcha += characters.charAt(
            Math.floor(
                Math.random() * characters.length
            )
        );

    }

    return captcha;
}

let currentCaptcha = generateCaptcha();


// ===============================
// HOME PAGE
// ===============================

app.get('/', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'frontend', 'index.html')
    );

});


// ===============================
// LONG 4TH SEMESTER URL
// ===============================

app.get(
    '/vtu-4thsemesterresults-may-june-2026',
    (req, res) => {

        res.sendFile(
            path.join(__dirname, 'frontend', 'index.html')
        );

    }
);


// ===============================
// GET CAPTCHA
// ===============================

app.get('/api/captcha', (req, res) => {

    currentCaptcha = generateCaptcha();

    res.json({

        captcha: currentCaptcha,

        message: 'New CAPTCHA generated'

    });

});


// ===============================
// VERIFY USN + CAPTCHA
// ===============================

app.post('/api/verify', (req, res) => {

    const { usn, captcha } = req.body;


    // Check input

    if (!usn || !captcha) {

        return res.status(400).json({

            success: false,

            message: 'USN and CAPTCHA are required'

        });

    }


    // Check CAPTCHA

    if (
        captcha.toUpperCase() !==
        currentCaptcha
    ) {

        return res.status(400).json({

            success: false,

            message: 'Invalid CAPTCHA'

        });

    }


    // Check USN

    const student =
        studentData[
            usn.toUpperCase()
        ];


    if (!student) {

        return res.status(404).json({

            success: false,

            message: 'USN not found'

        });

    }


    // Successful login

    res.json({

        success: true,

        data: {

            usn: student.usn,

            name: student.name,

            marksheet: student.marksheet

        }

    });

});


// ===============================
// GET STUDENT DETAILS
// ===============================

app.get('/api/student/:usn', (req, res) => {

    const usn =
        req.params.usn.toUpperCase();

    const student =
        studentData[usn];


    if (!student) {

        return res.status(404).json({

            success: false,

            message: 'Student not found'

        });

    }


    res.json({

        success: true,

        data: student

    });

});


// ===============================
// START SERVER
// ===============================

// 0.0.0.0 allows other devices
// on the same Wi-Fi to access this server

app.listen(PORT, '0.0.0.0', () => {

    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        `PC: http://localhost:${PORT}`
    );

    console.log(
        `Result: http://localhost:${PORT}/vtu-4thsemesterresults-may-june-2026`
    );

    console.log(
        `Current CAPTCHA: ${currentCaptcha}`
    );

});