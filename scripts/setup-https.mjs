import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {X509Certificate} from 'node:crypto';
import {createCertificate} from '../node_modules/@vitejs/plugin-basic-ssl/dist/chunks/certificate.mjs';
const dir=new URL('../.local/https/',import.meta.url);await mkdir(dir,{recursive:true});let pem;try{pem=await readFile(new URL('localhost.pem',dir),'utf8')}catch{pem=createCertificate('localhost',['localhost'],365);await writeFile(new URL('localhost.pem',dir),pem)}
const cert=new X509Certificate(pem);await writeFile(new URL('localhost-lr6.cer',dir),cert.raw);console.log({subject:cert.subject,SAN:cert.subjectAltName,validTo:cert.validTo,fingerprint:cert.fingerprint256});
