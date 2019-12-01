const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: [process.env.CASSANDRA_IP || 'cassandra'], localDataCenter: 'datacenter1' });
client.connect(function (err, result) {
	console.log('obras: cassandra connected');
});

exports.list = (req, res) => {
	console.log('obras: list');
	client.execute('SELECT * FROM db_biblioteca.obras', [], function (err, result) {
		if (err) {
			console.log('obras: list err:', err);
			res.status(404).send({ msg: err });
		} else {
			console.log('obras: list succ:', result.rows);
			res.render('obras', { page_title: "Obras", data: result.rows })
		}
	});
};

exports.add = (req, res) => {
	res.render('add_obra', { page_title: "Adicionar obra" });
};

exports.edit = (req, res) => {
	const id = req.params.id;
	console.log('obras: edit');

	client.execute("SELECT * from db_biblioteca.obras WHERE idobra = " + id + " ALLOW FILTERING", [], function (err, result) {
		if (err) {
			console.log('obras: edit err:', err);
			res.status(404).send({ msg: err });
		} else {
			console.log('obras: edit succ:');
			res.render('edit_obra', { page_title: "Editar obras", data: result.rows });
		}
	});

};

exports.save = (req, res) => {
	const input = JSON.parse(JSON.stringify(req.body));

	console.log('obras: save');
	console.log(input.NuAno);
	

	client.execute(`INSERT INTO db_biblioteca.obras 
			(IdObra, NoObra, NuAno, NuEdicao, VaPreco, IdIdioma, IdEditora) VALUES 
			(now(), '${input.NoObra}', ${input.NuAno}, '${input.NuEdicao}', ${input.VaPreco},
			${input.IdIdioma}, ${input.IdEditora})`, [], function (err, result) {
		if (err) {
			console.log('obras: add err:', err);
			res.status(404).send({ msg: err });
		} else {
			console.log('obras: add succ:');
			res.redirect('/obras');
		}
	});
};

exports.save_edit = (req, res) => {
	const input = JSON.parse(JSON.stringify(req.body));
	const id = req.params.id;

	console.log('obras: save_edit');

	client.execute(`UPDATE db_biblioteca.obras set noobra = '${input.noobra}', nuano = ${input.nuano},
	nuedicao = '${input.nuedicao}', vapreco = ${input.vapreco}, ididioma = ${input.ididioma},
	ideditora = ${input.ideditora} WHERE idobra = ${input.idobra}`, [], function (err, result) {
		if (err) {
			console.log('obras: save_edit err:', err);
			res.status(404).send({ msg: err });
		} else {
			console.log('obras: save_edit succ:');
			res.redirect('/obras');
		}
	});

};

exports.delete_customer = (req, res) => {
	const id = req.params.id;

	console.log('obras: delete');

	client.execute("DELETE FROM db_biblioteca.obras WHERE idobra = " + id, [], function (err, result) {
		if (err) {
			console.log('obras: delete err:', err);
			res.status(404).send({ msg: err });
		} else {
			console.log('obras: delete succ:');
			res.redirect('/obras');
		}
	});

};
