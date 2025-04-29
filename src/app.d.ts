/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
			status?: number;
		}

		interface Locals {
			user?: {
				id: string;
				email: string;
				role: string;
			};
			session?: {
				token: string;
				expiresAt: Date;
			};
		}

		interface PageData {
			user?: {
				id: string;
				email: string;
				role: string;
			};
		}

		interface Platform {}

		interface PrivateEnv {
			DB_URL: string;
			JWT_SECRET: string;
		}

		interface PublicEnv {
			PUBLIC_API_URL: string;
		}
	}

	interface ViewTransition {
		updateCallbackDone: Promise<void>;
		ready: Promise<void>;
		finished: Promise<void>;
		skipTransition: () => void;
	}
}

export {}; 