const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_IP || 'cassandra'], localDataCenter: 'datacenter1' });

exports.init_cassandra = (req, res) => {
	client.connect()
		.then(() => {
			const query = "CREATE KEYSPACE IF NOT EXISTS db_biblioteca WITH replication =" +
				"{'class': 'SimpleStrategy', 'replication_factor': '1' }";
			return client.execute(query);
		})
		.then(() => {
			const query = "CREATE TABLE IF NOT EXISTS db_biblioteca.obras" +
				" (IdObra uuid, NoObra text, NuAno int, NuEdicao text, VaPreco float, IdIdioma int, IdEditora int, PRIMARY KEY (IdObra))";
			return client.execute(query);
		})
		.then(() => {
			return client.metadata.getTable('db_biblioteca', 'obras');
		})
		.then(table => {
			console.log('Table information');
			console.log('- Name: %s', table.name);
			console.log('- Columns:', table.columns);
			console.log('- Partition keys:', table.partitionKeys);
			console.log('- Clustering keys:', table.clusteringKeys);
		})
		.then(() => {
			console.log('Read cluster info');
			let str = '{"hosts": [';
			let i = 1
			client.hosts.forEach(host => {
				i++;
				str += '{"address" : "' + host.address + '", "version" : "' + host.cassandraVersion + '", "rack" : "' + host.rack + '", "datacenter" : "' + host.datacenter + '"}';
				console.log(str);

				console.log("hosts.length: " + client.hosts.length);
				if (i < client.hosts.length)
					str += ',';

			});
			str += ']}';
			console.log('JSON string: ' + str);
			let jsonHosts = JSON.parse(str);
			res.render('cassandra', { page_title: "Detalhes do banco", data: jsonHosts.hosts });
			console.log('initCassandra: success');
		})
		.catch(err => {
			console.error('There was an error', err);
			res.status(404).send({ msg: err });
			return client.shutdown();
		});
};
