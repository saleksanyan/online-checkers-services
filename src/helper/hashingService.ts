import * as crypto from 'crypto';

export class HashingService {
	static hashData(data: string): string {
		return crypto.createHash('sha256').update(data).digest('hex');
	}

	static verifyHash(data: string, hash: string): boolean {
		const hashedData = this.hashData(data);
		return hashedData === hash;
	}
<<<<<<< addedAPI
}
=======
}
>>>>>>> main
