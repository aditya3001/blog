const express = require('express')
const app = express()
const path = require('path')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'hbs')
    // app.set('views','ssr')

app.use('/', express.static(path.join(__dirname, 'static')))
blogs = []

app.get('/blogs/delete/:idToRemove/:mode', (req, res) => {
    console.log("In Delete")
    let idToRemove = req.params.idToRemove
    let mode = req.params.mode
    index = blogs.findIndex(x => x.id === idToRemove);
    blogs.splice(idToRemove - 1, 1);
    if (mode != 'json') {
        return res.redirect('/blogs?mode=hbs')
    }
    return res.send('success')
})

app.get('/blogs/swap', (req, res) => {
    let mode = req.query.mode
    let id1 = req.query.id1
    let action = req.query.action
    if (action == 'up') {
        swap(id1, id1 - 1)
    } else if (action == 'down') {
        console.log('down')
        swap(parseInt(id1, 10), parseInt(id1, 10) + 1)
    } else {
        let id2 = req.query.id2
        swap(id1, id2)
    }
    if (mode != 'json') {
        return res.redirect('/blogs?mode=hbs')
    }
    return res.send('success')
})

app.get('/blogs', (req, res) => {
    blogs.forEach((item, i) => item.id = i + 1);
    if (req.query.mode == 'json') {
        return res.send(blogs)
    } else {
        return res.render('blogs', {
            title: 'Blogs Views',
            blogs
        })
    }
})

app.get('/blogs/hbs/edit/:id', (req, res) => {
    let idEdit = req.params.id
    idx = blogs.findIndex(x => x.id == idEdit);
    let content
    if (idx != -1) {
        content = blogs[idx].content
    }
    return res.render('editView', {
        id: idEdit,
        title: 'Edit Screen',
        content
    })
})

app.post('/blogs', (req, res) => {
    blogs.push({
        id: blogs.length + 1,
        title: req.body.title,
        category: req.body.category,
        email: req.body.email,
        author: req.body.author,
        content: req.body.content,
        uploadDate: req.body.uploadDate
    })
    if (req.body.mode == "json") {
        return res.send('success')
    }
    return res.redirect('/blogs')
})

app.post('/blogs/edit/:id1', (req, res) => {

    idToEdit = req.params.id1
    newContent = req.body.content
    index = blogs.findIndex(x => x.id == idToEdit);
    blogs[index].content = newContent
    if (req.body.mode == "json") {
        return res.send('success')
    }
    return res.redirect('/blogs')
})

function swap(id1, id2) {

    if (id2 > 0 && id2 < (blogs.length + 1)) {
        let temp = blogs[id1 - 1]
        blogs[id1 - 1] = blogs[id2 - 1]
        blogs[id2 - 1] = temp
    }
}

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/blogs')
})