import Docker from 'dockerode';

export interface PostgresContainerConfig {
	port?: number;
	password?: string;
	database?: string;
	user?: string;
	containerName?: string;
}

export interface PostgresContainer {
	container: Docker.Container;
	connectionString: string;
	stop: () => Promise<void>;
}

/**
 * Create and start a PostgreSQL Docker container
 * Uses postgres:16-alpine for a lightweight, production-ready database
 */
export async function createPostgresContainer(
	config?: PostgresContainerConfig,
): Promise<PostgresContainer> {
	const docker = new Docker();
	const port = config?.port || 5432;
	const password = config?.password || 'postgres';
	const database = config?.database || 'drizzle_test';
	const user = config?.user || 'postgres';
	const containerName = config?.containerName || `drizzle-scratchpad-${Date.now()}`;

	const pullStream = await docker.pull('postgres:16-alpine');
	await new Promise((resolve, reject) => {
		docker.modem.followProgress(pullStream, (err) => (err ? reject(err) : resolve(err)));
	});

	const container = await docker.createContainer({
		Image: 'postgres:16-alpine',
		name: containerName,
		Env: [
			`POSTGRES_PASSWORD=${password}`,
			`POSTGRES_DB=${database}`,
			`POSTGRES_USER=${user}`,
		],
		HostConfig: {
			AutoRemove: true,
			PortBindings: {
				'5432/tcp': [{ HostPort: `${port}` }],
			},
		},
	});

	await container.start();
	console.log(`Container started on port ${port}`);

	const connectionString = `postgresql://${user}:${password}@localhost:${port}/${database}`;

	return {
		container,
		connectionString,
		stop: async () => {
			await container.stop();
			console.log('Container stopped');
		},
	};
}

const { container, connectionString } = await createPostgresContainer({
	port: 5433,
	database: 'drizzle_beta_test',
});

console.log({
	connectionString,
	containerId: container.id,
});
