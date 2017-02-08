(function() {
        "use strict"

        const orgModule = function() {
            const searchForm = document.querySelector('.search-form');
            const apiKey = '5754a25134f48526060081972ab335fbe8e86542';
            const noOrgo = document.querySelector('.no-orgo');

            class OrgDetail {
                constructor(orgObj) { // accepts arguments from the new orgDetails(response) instance
                    this.image = orgObj.avatar_url;
                    this.title = orgObj.login;
                    this.build(); // anytime a new orgDetail is created, the build function is called inside the constructor
                }

                build() { // this could also be a OrgoDetail.prototype.build = function() (outside of class ?) & use the prototype method to build & that the constructor & instances have access to as well
                    const source = $('#org-template').html(); // grab a string of html from the element
                    const template = Handlebars.compile(source) // turns string into handlebars function
                    const context = { // key value pairs that match the keys being asked for in the template, will be added dynamically & using key value pairs from the consturctor
                        image: this.image,
                        title: this.title
                    };
                    const html = template(context) // this is how the context object gets passed into the template
                    let container = $('<div>').attr('class', 'organization-container');
                    let image = $('<img>').attr('src', this.image).prependTo(container);
                    let label = $('<h2>').html(this.title).appendTo(container);
                    $(container).prependTo('.content');
                }
            }

        function bindEvents() {
            searchForm.addEventListener('submit', () => {
                event.preventDefault();
                const searchValue = event.target[0].value; // grab the input value
                console.log(event.target[0].value);

                getOrgoResults(searchValue); // pass in search value to getOrgoResults function

                searchForm.reset(); // clear the form everytime it is submitted
            });
        }

        function getOrgoResults(query) { // query is the searchvalue (username)
            query = encodeURIComponent(query); // make searchValue url-friendly
            $.ajax({ // removed simple get request and used ajax
                type: 'GET',
                url: `https://api.github.com/users/${query}/orgs?api_key=${apiKey}`,
                success(response) {
                    console.log(response);
                    if (response.length === 0) {
                    $(noOrgo).removeClass('is-hidden'); // show error container if no response is found
                    $('.content').addClass('is-hidden'); // add is-hidden class to content when no response is found
                    } else if (noOrgo.classList !== 'no-orgo is-hidden') {
                        $('.no-orgo').addClass('is-hidden'); // else add the class is-hidden to the container if the class doesn't have is-hidden already
                        $('.content').removeClass('is-hidden'); // remove is-hidden class from content
                    }
                    for(let index = 0; index < response.length; index++) { //*** iterate over each index/object of the array of objects from the response ***
                        new OrgDetail(response[index]); // whenever a response is given, create new instance of OrgDetails with the response[index] as a parameter so it has access to it ***
                        console.log(response[index]);
                    }
                },
                error(jqXHR, testStatus, error) {
                    console.log(error);
                }
            });
        }

        function init() {
            console.log('in')
            bindEvents();
        }

        return {
            init: init
        };
    }
    const orgApp = orgModule();
    orgApp.init();

})();
