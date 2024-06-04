import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function createDatabase() {
	const client = new Client({
		user: process.env.DB_USERNAME,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: Number(process.env.DB_PORT),
	});

	await client.connect();

	const dbName = process.env.DB_NAME;

	try {
		await client.query(`CREATE DATABASE ${dbName}`);
		console.log(`Database ${dbName} created successfully.`);
	} catch (error) {
		if (error.code === '42P04') {
			console.log(`Database ${dbName} already exists.`);
		} else {
			console.error(`Failed to create database ${dbName}:`, error);
		}
	} finally {
		await client.end();
	}
}

createDatabase().catch(console.error);
