function renderErrorPage(res, message)
{
    res.render("error", { content: message, layout: false }, function(err, html)
    {
        res.render("layout", { title: "Error", content: html, layout: false });
    });
}

module.exports =
{
    renderErrorPage
};