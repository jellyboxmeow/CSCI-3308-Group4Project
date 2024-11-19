const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming there's a database connection file

// Middleware to ensure only admins can access
function adminAuth(req, res, next) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).send('Access denied. Admins only.');
    }
    next();
}

// Admin Home Page
router.get('/home', adminAuth, (req, res) => {
    res.render('pages/admin_home', { admin: req.session.user });
});

// Manage Achievements
router.get('/achievements', adminAuth, async (req, res) => {
    const achievements = await db.any('SELECT * FROM achievements');
    res.render('pages/admin_achievements', { achievements });
});

router.post('/achievements', adminAuth, async (req, res) => {
    const { title, description } = req.body;
    await db.none('INSERT INTO achievements (title, description) VALUES ($1, $2)', [title, description]);
    res.redirect('/admin/achievements');
});

router.post('/achievements/delete/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    await db.none('DELETE FROM achievements WHERE id = $1', [id]);
    res.redirect('/admin/achievements');
});

// Other admin functionality to be added here

module.exports = router;
// Manage Forums - View all threads
router.get('/forums', adminAuth, async (req, res) => {
    const forums = await db.any('SELECT * FROM forums');
    res.render('pages/admin_forums', { forums });
});

// Add a new thread
router.post('/forums', adminAuth, async (req, res) => {
    const { title, description } = req.body;
    await db.none('INSERT INTO forums (title, description) VALUES ($1, $2)', [title, description]);
    res.redirect('/admin/forums');
});

// Delete a thread
router.post('/forums/delete/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    await db.none('DELETE FROM forums WHERE id = $1', [id]);
    res.redirect('/admin/forums');
});
// Manage Achievements - View all achievements
router.get('/achievements', adminAuth, async (req, res) => {
    const achievements = await db.any('SELECT * FROM achievements');
    res.render('pages/admin_achievements', { achievements });
});

// Add a new achievement
router.post('/achievements', adminAuth, async (req, res) => {
    const { title, description } = req.body;
    await db.none('INSERT INTO achievements (title, description) VALUES ($1, $2)', [title, description]);
    res.redirect('/admin/achievements');
});

// Edit an achievement
router.post('/achievements/edit/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    await db.none('UPDATE achievements SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
    res.redirect('/admin/achievements');
});

// Delete an achievement
router.post('/achievements/delete/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    await db.none('DELETE FROM achievements WHERE id = $1', [id]);
    res.redirect('/admin/achievements');
});
// Enhanced error handling and validation for achievements
router.post('/achievements', adminAuth, async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).send('Title and description are required.');
        }
        await db.none('INSERT INTO achievements (title, description) VALUES ($1, $2)', [title, description]);
        res.redirect('/admin/achievements');
    } catch (err) {
        console.error('Error adding achievement:', err);
        res.status(500).send('Failed to add achievement.');
    }
});

router.post('/achievements/edit/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).send('Title and description are required.');
        }
        await db.none('UPDATE achievements SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
        res.redirect('/admin/achievements');
    } catch (err) {
        console.error('Error editing achievement:', err);
        res.status(500).send('Failed to edit achievement.');
    }
});

// Add role validation on login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = user;

            if (user.isAdmin) {
                req.session.user.isAdmin = true;
            }

            res.redirect(user.isAdmin ? '/admin/home' : '/home');
        } else {
            res.status(400).send('Invalid username or password.');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Login failed.');
    }
});
// Manage Guides - View all guides
router.get('/guides', adminAuth, async (req, res) => {
    try {
        const guides = await db.any('SELECT * FROM guides');
        res.render('pages/admin_guides', { guides });
    } catch (err) {
        console.error('Error fetching guides:', err);
        res.status(500).send('Failed to load guides.');
    }
});

// Add a new guide
router.post('/guides', adminAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }
        await db.none('INSERT INTO guides (title, content) VALUES ($1, $2)', [title, content]);
        res.redirect('/admin/guides');
    } catch (err) {
        console.error('Error adding guide:', err);
        res.status(500).send('Failed to add guide.');
    }
});

// Edit a guide
router.post('/guides/edit/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send('Title and content are required.');
        }
        await db.none('UPDATE guides SET title = $1, content = $2 WHERE id = $3', [title, content, id]);
        res.redirect('/admin/guides');
    } catch (err) {
        console.error('Error editing guide:', err);
        res.status(500).send('Failed to edit guide.');
    }
});

// Delete a guide
router.post('/guides/delete/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.none('DELETE FROM guides WHERE id = $1', [id]);
        res.redirect('/admin/guides');
    } catch (err) {
        console.error('Error deleting guide:', err);
        res.status(500).send('Failed to delete guide.');
    }
});
