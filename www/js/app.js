/*****************************************************************
File: app.js
Author: Julien Tougas
Description: Giftr app
Version: 1.0.1
Updated: Mar 31, 2017
*****************************************************************/
var peopleLocal = {
        people: []
    }
    , key = "giftr-toug0008"
    , personId = ""
    , currentId = "";
var app = {
    // Application Constructor
    initialize: function () {
            document.addEventListener('deviceready', function () {
                window.addEventListener('push', app.pageChanged);
                app.pageChanged();
            });
        }
        //
        
    , pageChanged: function () {
            var sPath = window.location.pathname;
            var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
            if (sPage == "gifts.html") {
                var giftFor = document.querySelector("#giftFor")
                    , title = document.querySelector("#title");
                peopleLocal.people.forEach(function (person, i) {
                    if (person.id == currentId) {
                        title.innerHTML = person.name;
                        giftFor.innerHTML = person.name;
                    }
                })
                document.querySelector("#saveGift").addEventListener('touchend', function (ev) {
                    app.saveGift(currentId, ev);
                    app.displayGifts(currentId);
                });
                document.querySelector("#addIdea").addEventListener("touchend", function () {
                    document.querySelector("#idea").value = "";
                    document.querySelector("#at").value = "";
                    document.querySelector("#url").value = "";
                    document.querySelector("#cost").value = "";
                })
                window.addEventListener('push', app.goBack);
                app.displayGifts(currentId);
            }
            else {
                document.querySelector("#addPerson").addEventListener("touchend", function () {
                    document.querySelector("#fullName").value = "";
                    document.querySelector("#dob").value = "";
                    document.querySelector("#save").addEventListener("touchend", app.savePerson);
                })
            }
        }
        //
        
    , checkIfSaveOrEdit: function () {
            window.removeEventListener("touchend", app.checkIfSaveOrEdit);
            if (document.querySelector("#fullName").value == "") {
                console.log(document.querySelector("#fullName").value);
                app.savePerson();
            }
            else {
                console.log(document.querySelector("#fullName").value);
                app.editPerson();
            }
        }
        //
        
    , goBack: function () {
            var sPath = window.location.pathname;
            var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
            if (sPage == "index.html") {
                window.removeEventListener("push", app.goBack);
                app.displayPeople();
            }
        }
        //
        
    , savePerson: function (currentId) {
            document.querySelector("#save").removeEventListener("touchend", app.savePerson);
            var personOBJ = {
                id: Date.now()
                , name: document.querySelector("#fullName").value
                , dob: document.querySelector("#dob").value
                , ideas: []
            }
            peopleLocal.people.push(personOBJ);
            localStorage.setItem(key, JSON.stringify(peopleLocal));
            console.log(peopleLocal);
            app.displayPeople();
        }
        //
        
    , editPerson: function () {
            peopleLocal.people.forEach(function (person, i) {
                if (person.id == currentId) {
                    var personOBJ = {
                        id: currentId
                        , name: document.querySelector("#fullName").value
                        , dob: document.querySelector("#dob").value
                        , ideas: person.ideas
                    }
                    peopleLocal.people.splice(i, 1);
                    peopleLocal.people.push(personOBJ);
                    localStorage.setItem(key, JSON.stringify(peopleLocal));
                    console.log(peopleLocal);
                }
            });
            app.displayPeople();
        }
        //
        
    , displayPeople: function () {
            peopleLocal = JSON.parse(localStorage.getItem(key));
            console.log("displayPeople");

            function compare(a, b) {
                if (a.dob.substring(5) < b.dob.substring(5)) return -1;
                if (a.dob.substring(5) > b.dob.substring(5)) return 1;
                return 0;
            }
            peopleLocal.people.sort(compare);
        
            var ul = document.querySelector("#contact-list");
            ul.innerHTML = "";
            peopleLocal.people.forEach(function (person, i) {
                var li = document.createElement("li")
                    , nameSpan = document.createElement("span")
                    , nameA = document.createElement("a")
                    , dobA = document.createElement("a")
                    , dobSpan = document.createElement("span");
                li.classList.add("table-view-cell");
                li.setAttribute("data-num", person.id);
                nameSpan.classList.add("name");
                nameA.setAttribute("href", "#personModal");
                dobA.classList.add("navigate-right", "pull-right");
                dobA.setAttribute("href", "gifts.html");
                dobSpan.classList.add("add");
                li.appendChild(nameSpan);
                li.appendChild(dobA);
                nameSpan.appendChild(nameA);
                dobA.appendChild(dobSpan);
                nameA.innerHTML = person.name;
                var momentTime = moment(person.dob);
                var newTime = new Date(momentTime);
                var date = moment(newTime).format("MMMM D");
                dobSpan.innerHTML = date;
                nameSpan.addEventListener("touchend", function (ev) {
                    document.querySelector("#fullName").value = person.name;
                    document.querySelector("#dob").value = person.dob;
                    app.getCurrentId(ev);
                    document.querySelector("#save").addEventListener("touchend", app.checkIfSaveOrEdit);
                })
                dobA.addEventListener("touchend", function (ev) {
                    app.getCurrentId(ev);
                });
                ul.appendChild(li);
            })
        }
        //
        
    , saveGift: function (personId, ev) {
            var captureId = personId
                , idea = document.querySelector("#idea")
                , at = document.querySelector("#at")
                , url = document.querySelector("#url")
                , cost = document.querySelector("#cost");
            console.log("saveGift outside if" + captureId);
            //if (ev != "") {
            peopleLocal.people.forEach(function (person) {
                    if (person.id == captureId) {
                        var giftOBJ = {
                            idea: idea.value
                            , at: at.value
                            , url: url.value
                            , cost: cost.value
                        }
                        console.log("saveGift inside both ifs");
                        person.ideas.push(giftOBJ);
                        localStorage.setItem(key, JSON.stringify(peopleLocal));
                        console.log(peopleLocal);
                    }
                })
                // }
            return captureId;
        }
        //
        
    , getCurrentId: function (ev) {
            currentId = ev.currentTarget.parentElement.getAttribute("data-num");
        }
        //
        
    , displayGifts: function (currentId) {
        console.log(currentId);
        peopleLocal = JSON.parse(localStorage.getItem(key));
        var giftUl = document.querySelector("#gift-list");
        giftUl.innerHTML = "";
        peopleLocal.people.forEach(function (person) {
            if (person.id == currentId) {
                person.ideas.forEach(function (idea, i) {
                    var giftLi = document.createElement("li")
                        , deleteSpan = document.createElement("span")
                        , giftDiv = document.createElement("div");
                    giftLi.classList.add("table-view-cell", "media");
                    deleteSpan.classList.add("pull-right", "icon", "icon-trash", "midline");
                    giftDiv.classList.add("media-body");
                    giftDiv.innerHTML = idea.idea;
                    giftLi.appendChild(deleteSpan);
                    giftLi.appendChild(giftDiv);
                    if (idea.at) {
                        var at = document.createElement("p");
                        at.innerHTML = idea.at;
                        giftDiv.appendChild(at);
                    }
                    if (idea.url) {
                        var urlp = document.createElement("p");
                        var urla = document.createElement("a");
                        urla.setAttribute("href", idea.url);
                        urlp.appendChild(urla);
                        urla.innerHTML = idea.url;
                        giftDiv.appendChild(urlp);
                    }
                    if (idea.cost) {
                        var cost = document.createElement("p");
                        cost.innerHTML = idea.cost
                        giftDiv.appendChild(cost);
                    }
                    deleteSpan.addEventListener("click", function (ev) {
                        var sp = ev.currentTarget;
                        person.ideas.splice(i, 1);
                        localStorage.setItem(key, JSON.stringify(peopleLocal));
                        sp.parentElement.parentElement.removeChild(sp.parentElement);
                        app.displayGifts(currentId);
                    });
                    giftUl.appendChild(giftLi);
                    giftContent.appendChild(giftUl);
                })
            }
        })
    }
};
app.initialize();