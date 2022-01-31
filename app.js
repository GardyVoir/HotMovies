const { Sequelize, Promise } = require('sequelize');
const express = require('express');

const sequelize = new Sequelize('sqlite:datas.db');
console.log(`On teste la connexion à la BDD`);

const Movie = sequelize.define('movie', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING(75),
        allowNull: false
    },
    synopsis: {
        type: Sequelize.STRING(3000),
        allowNull: false
    },
    director: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    listeActeurs: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL)
    }
});

const Rating = sequelize.define('rating', {
    id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(75),
        allowNull: false
    },
    message: {
        type: Sequelize.STRING(250)
    },
    stars: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Rating.belongsTo(Movie)
Movie.hasMany(Rating)

sequelize.authenticate()
    .then(() => {
        console.log('Connexion établie!')
        sequelize.sync({ force: true })
    })
    .then(() => {
        console.log('Les tables de ma BDD ont été bien générées!')
    })
    .catch((err) => {
        console.log(`Ma BDD plante, voici l'erreur: ${err}`)
    })

const app = express();
const port = 5000;
app.use(express.json());

app.get('/movies', (req, res) => {
    if ((req.query.MovieId && req.query.MovieId.trim())) {
        Movie.findByPk(req.query.MovieId, { include: [{ all: true }] }).then(Movie => res.json(Movie))
    }
    else {
        Movie.findAll({ include: [{ all: true }] }).then(Movie => res.json(Movie))
    }
})

app.post('/movie', (req, res) => {
    var title = req.body.title.trim()
    var synopsis = req.body.synopsis.trim()
    var director = req.body.director.trim()
    var listeActeurs = req.body.listeActeurs

    if ((req.body.title && title) && title.length <= 75) {
        // title OK
    }
    else { return res.json({ msg: "Le titre n'est pas valide" }) }

    if ((req.body.synopsis && synopsis) && synopsis.length <= 3000) {
        // synopsis OK
    }
    else { return res.json({ msg: "Le synopsis n'est pas valide" }) }

    if ((req.body.director && director) && director.length <= 60) {
        // director OK
    }
    else { return res.json({ msg: "Le nom de réalisateur n'est pas valide" }) }

    if (listeActeurs != null && listeActeurs.length > 0) {
        listeActeurs.forEach(Acteur => {
            if ((Acteur && Acteur.trim())) {
                // Acteur OK
            }
            else { return res.json({ msg: "Le nom d'acteur n'est pas valide" }) }
        });
    }

    Movie.create({
        title: title,
        synopsis: synopsis,
        director: director,
        listeActeurs: listeActeurs
    })
    return res.json({ msg: "Film ajouté" })
})

app.put('/movie', (req, res) => {
    var title = req.body.title.trim()
    var synopsis = req.body.synopsis.trim()
    var director = req.body.director.trim()
    var listeActeurs = req.body.listeActeurs

    if ((req.body.title && title) && title.length <= 75) {
        // title OK
    }
    else { return res.json({ msg: "Le titre n'est pas valide" }) }

    if ((req.body.synopsis && synopsis) && synopsis.length <= 3000) {
        // synopsis OK
    }
    else { return res.json({ msg: "Le synopsis n'est pas valide" }) }

    if ((req.body.director && director) && director.length <= 60) {
        // director OK
    }
    else { return res.json({ msg: "Le nom de réalisateur n'est pas valide" }) }

    if (listeActeurs != null && listeActeurs.length > 0) {
        listeActeurs.forEach(Acteur => {
            if ((Acteur && Acteur.trim())) {
                // Acteur OK
            }
            else { return res.json({ msg: "Le nom d'acteur n'est pas valide" }) }
        });
    }

    Movie.update({
        title: title,
        synopsis: synopsis,
        director: director,
        listeActeurs: listeActeurs
    })
    return res.json({ msg: "Film mis à jour" })
})

app.delete('/movie', (req, res) => {
    Movie.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (deletedRecord) {
        if (deletedRecord === 1) {
            res.status(200).json({ message: "Film supprimée" });
        }
        else {
            res.status(404).json({ message: "Film non trouvé" })
        }
    })
})

app.post('/rating', (req, res) => {
    var name = req.body.name.trim()
    var movieId = parseInt(req.body.movieId, 10)
    var message = req.body.message.trim()
    var stars = parseInt(req.body.stars, 10)

    if ((req.body.name && name) && name.length <= 75) {
        // name OK
    }
    else { return res.json({ msg: "Le nom n'est pas valide" }) }

    if ((req.body.movieId && movieId)) {
        // movieId OK
    }
    else { return res.json({ msg: "L'identifiant de film n'est pas valide" }) }

    if ((req.body.message && message) && message.length <= 250) {
        // message OK
    }
    else { return res.json({ msg: "Le message n'est pas valide" }) }

    if ((req.body.stars && stars) && stars > 0 && stars < 6) {
        // stars OK
    }
    else { return res.json({ msg: "La notation n'est pas valide" }) }

    Rating.create({
        name: name,
        movieId: movieId,
        message: message,
        stars: stars
    })
    return res.json({ msg: "Notation ajoutée" })
})

app.put('/rating', (req, res) => {
    var name = req.body.name.trim()
    var movieId = parseInt(req.body.movieId, 10)
    var message = req.body.message.trim()
    var stars = parseInt(req.body.stars, 10)

    if ((req.body.name && name) && name.length <= 75) {
        // name OK
    }
    else { return res.json({ msg: "Le nom n'est pas valide" }) }

    if ((req.body.movieId && movieId)) {
        // movieId OK
    }
    else { return res.json({ msg: "L'identifiant de film n'est pas valide" }) }

    if ((req.body.message && message) && message.length <= 250) {
        // message OK
    }
    else { return res.json({ msg: "Le message n'est pas valide" }) }

    if ((req.body.stars && stars) && stars > 0 && stars < 6) {
        // stars OK
    }
    else { return res.json({ msg: "La notation n'est pas valide" }) }

    Rating.update({
        name: name,
        movieId: movieId,
        message: message,
        stars: stars
    })
    return res.json({ msg: "Notation mise à jour" })
})

app.delete('/rating', (req, res) => {
    Rating.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (deletedRecord) {
        if (deletedRecord === 1) {
            res.status(200).json({ message: "Notation supprimée" });
        }
        else {
            res.status(404).json({ message: "Notation non trouvée" })
        }
    })
})

sequelize.authenticate()
    .then(() => {
        console.log("Database connection OK!");
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.log('Unable to connect to the database');
        console.log(err.message);
        process.exit();
    })