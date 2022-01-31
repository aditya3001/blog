$(() => {

    let title = $('#title')
    let category = $('#category')
    let email = $('#email')
    let author = $('#author')
    let date = $('#uploadDate')
    let content = $('#content')
    let btn = $('#btn')
    let blogList = $('#blogList')
    let myDiv = $('#myDiv')



    function refreshBlogList() {
        $.get('/blogs?mode=json', (blogs) => {
            $("#myDiv").empty()
            for (let blog of blogs) {
                html = $("<div class='card'>").append($("<div class='card-body'>")
                    .append($('<h3>').attr('class', 'card-title').text(`Title : ${blog.title}`))
                    .append($('<h4>').attr('class', 'card-subtitle mb-2 text-muted').text(`CATEGORY : ${blog.category}`))
                    .append($('<h4>').attr('class', 'card-subtitle mb-2 text-muted').text(`BY : ${blog.author}(${blog.email})`))
                    .append($('<h5>').attr('class', 'card-subtitle mb-2 text-muted').text(blog.uploadDate))
                    .append($('<div>').attr('class', 'box')
                        .append($('<span>').attr('class', 'edit').text('edit').click(function() {
                            $(this).hide();
                            console.log($(this).next().next())
                            $(this).parent().addClass('editable');
                            $(this).next().next().attr('contenteditable', 'true');
                            $(this).next().show();
                        }))
                        .append($('<span>').attr('class', 'save').text('save').click(function() {
                            $(this).hide();
                            $(this).parent().removeClass('editable');
                            console.log($(this).next().text())
                            console.log(blog.id)
                            $.post('/blogs/edit/' + blog.id, {
                                id: blog.id,
                                content: $(this).next().text(),
                                mode: 'json'
                            }, (data) => {
                                if (data == 'success') {
                                    refreshBlogList()
                                } else {
                                    alert(data)
                                }
                            });
                            $(this).next().removeAttr('contenteditable');
                            $(this).prev().show();
                        }))
                        .append($('<div>').attr('class', 'text').text(blog.content)))
                    .append($('<button>').addClass('btn-primary-jq').text('Up').click((ev) => {
                        $.get('/blogs/swap?mode=json&&id1=' + blog.id + "&&id2=" + (blog.id - 1))
                        refreshBlogList()
                    }))
                    .append($('<button>').addClass('btn-primary-jq').text('Down').click((ev) => {
                        $.get('/blogs/swap?mode=json&&id1=' + blog.id + "&&id2=" + (blog.id + 1))
                        refreshBlogList()
                    }))
                    .append($('<button>').addClass('btn-primary-jq').text('Delete').click((ev) => {
                        $.get('/blogs/delete/' + blog.id + '/json')
                        refreshBlogList()
                    }))
                );

                $("#myDiv").append(html);
            }
        })
    }
    refreshBlogList()

    btn.click((ev) => {
        ev.preventDefault()
        $.post('/blogs', {
            title: title.val(),
            category: category.val(),
            email: email.val(),
            author: author.val(),
            uploadDate: date.val(),
            content: content.val(),
            mode: "json"
        }, (data) => {
            if (data == 'success') {
                refreshBlogList()
            } else {
                alert(data)
            }
        })
    })
})