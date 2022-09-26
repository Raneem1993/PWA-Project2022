const express = require('express');
const dotenv = require('dotenv');
const blogRouter = require("./routes/blogs");
const Blog = require("./models/Blog");
const mongoose = require('mongoose');
const methodOverride = require('method-override');


mongoose.connect('mongodb+srv://RaneemAbouGhalyoun:Jalal123@cluster0.croxj72.mongodb.net/crudblog?retryWrites=true&w=majority');






require('dotenv').config();




dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080;






const app = express();



app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}));
app.use(methodOverride('_method'));
app.use(express.json());


app.use('/blogs', blogRouter);



app.set("view engine", "ejs");

app.get('/', async (req, res)=>{
    let blogs = await Blog.find().sort({ timeCreated: 'desc'});

    res.render('index', {blogs: blogs});
});

app.listen(PORT,()=>{console.log(`Server is running on http://localhost:${PORT}`)});