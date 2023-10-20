const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Nodemailer
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "epiresolve@gmail.com",
        pass: "oicm bxwo dsyc bmbp" 
    }
});

const fixedText = "Olá, fico feliz que queira receber nosso PDF";
const fixedHtml = "Olá, a seguir segue nosso PDF para recebimento <a href='https://drive.google.com/drive/folders/1l--CJkcsYmBAgrakJsLN63k2Pqd2oYsV?usp=sharing'>Clique aqui para baixar</a> =)";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/send-email", (req, res) => {
    const to = req.body.to;
    const subject = req.body.subject;

    const pdfFilePath = "./pdfs/PDF - EPIRESOLVE.pdf";

    // Lê o conteúdo do arquivo PDF de forma assíncrona
    fs.readFile(pdfFilePath, (err, data) => {
        if (err) {
            console.log(err);
            res.send("Erro ao ler o arquivo PDF.");
            return;
        }

        transporter.sendMail({
            from: "EPIRESOLVE - <epiresolve@gmail.com>",
            to: to,
            subject: subject,
            text: fixedText,
            html: fixedHtml,
            attachments: [
                {
                    filename: "PDF - EPIRESOLVE.pdf",
                    content: data
                }
            ]
        })
        .then(messageInfo => {
            console.log(messageInfo);
            res.send("Email enviado com sucesso!");
        })
        .catch(error => {
            console.log(error);
            res.send("Erro ao enviar o email.");
        });
    });
});

// Rota para fazer o download do PDF
app.get("/download-pdf", (req, res) => {
    const pdfFilePath = "./pdfs/PDF - EPIRESOLVE.pdf";
    const fileName = "PDF - EPIRESOLVE.pdf";
    const filePath = path.join(__dirname, pdfFilePath);

    res.setHeader("Content-disposition", "attachment; filename=" + fileName);
    res.setHeader("Content-type", "application/pdf");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
