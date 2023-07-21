"use strict";

// for fellow developers looking at this, this will be released on https://ari-web.xyz/gh/vgp.ari-web.xyz at the end of the project

let today = document.createElement("input");

today.type = "text";
today.placeholder = "Šiandiena aš jaučiuosi...";

const FREQ_RATING = [
    "Kasdien",
    "Dažnai",
    "Kartais",
    "Retai",
    "Labai retai",
    "Niekada",
];

const RATING = [
    "Puikiai",
    "Labai gerai",
    "Gerai",
    "Gali būti geriau",
    "Blogai",
    "Labai blogai",
    "Tragiškai",
];

const YES_NO = ["Taip", "Dažniausiai taip", "Dažniausiai ne", "Ne"];

const QUIZ = {
    "Jūsų lytinė orientacija": ["Moteris", "Vyras", "Kita"],
    "Jūsų gimnazinė klasė": ["I", "II", "III", "IV"],
    "Kaip dažnai jaučiatės prastai (pervargę, prislėgti, liūdni, ...)?": FREQ_RATING,
    "Kaip gerai sutariate su savo bendraklasiais ir mokytojais?": RATING,
    "Ar jums būna sunku susikaupti pamokos metu ar atliekant namų darbus?":
        YES_NO,
    "Ar jaučiate, kad gaunate pakankamai socialinės paramos ir pagalbos savo aplinkoje (mokykloje, namuose, ...)?":
        YES_NO,
    "Kiek laiko per dieną skiriate mankštai ir fiziniam aktyvumui?": [
        "0-30 min.",
        "30-60 min.",
        "1-2 val.",
        "2-3 val.",
        "3-4 val. ir daugiau",
    ],
    "Ar jaučiate spaudimą išlaikyti aukštus akademinius rezultatus?": YES_NO,
    "Ar randate laiko užsiimti savo norima veikla?": YES_NO,
    "Kaip įsivertintumėte savo emocinę sveikatą?": RATING,
    "Ar manote, kad gimnazija sudaro palankią aplinką mokinių emociniai gerovei?": YES_NO,
    "Kaip dažnai susiduriate su sunkumais kontroliuojant savo nerimą?":
        FREQ_RATING,
    "Kaip jaučiatės apie save (savivertė)?": RATING,
    "Kam teikiate pirmenybę: mokyklai ar savijautai?": [
        "Mokyklai",
        "Savijautai",
    ],
    "Kaip įsivertintumėte savo miego kokybę?": RATING,
    "Kaip jaučiatės šiandien?": today,
};
const QUIZ_SIZE = Object.keys(QUIZ).length;

function main() {
    let form = document.getElementById("form");
    let submit = document.createElement("button");

    submit.innerText = "pateikti";

    for (let [qidx, [question, options]] of Object.entries(QUIZ).entries()) {
        let div = document.createElement("div");

        let bq = document.createElement("blockquote");
        let ul = document.createElement("ul");

        bq.innerText = `${qidx + 1}/${QUIZ_SIZE}: ${question}`;

        if (Array.isArray(options))
            for (let idx = 0; idx < options.length; ++idx) {
                let li = document.createElement("li");
                let input = document.createElement("input");
                let label = document.createElement("label");

                input.type = "radio";
                input.name = question;
                input.id = `${idx}${question}`;
                input.innerText = options[idx];
                input.dataset.idx = idx;

                label.htmlFor = input.id;
                label.innerText = ` ${options[idx]}`;

                li.appendChild(input);
                li.appendChild(label);
                ul.appendChild(li);
            }
        else {
            let li = document.createElement("li");
            options.name = question;
            li.appendChild(options);
            ul.appendChild(li);
        }

        div.appendChild(bq);
        div.appendChild(ul);

        form.appendChild(div);
    }

    form.appendChild(submit);

    form.onsubmit = () => {
        let output = [];

        for (let div of form.children) {
            if (div.tagName !== "DIV") continue;

            let ul = div.querySelector("ul");

            if (ul.children.length === 1) {
                let input = ul.children[0].children[0];

                if (!input.value) {
                    alert(`Neužpildytas tekstinis klausimas: ${input.name}`);
                    input.scrollIntoView();
                    input.focus();
                    return false;
                }

                output.push(input.value);
            } else {
                let input;

                for (let li of ul.children) {
                    input = li.children[0];

                    if (input.checked) {
                        output.push(input.dataset.idx);
                        break;
                    }
                }

                if (!input.checked) {
                    alert(
                        `Neužpildytas pasirenkamasis klausimas: ${input.name}`,
                    );
                    ul.scrollIntoView();
                    return false;
                }
            }
        }

        let fdata = new FormData();
        fdata.set("data", JSON.stringify(output));

        fetch("https://server.ari-web.xyz/store", {
            method: "POST",
            body: fdata,
        })
            .then((r) => r.text())
            .then((text) => {
                form.innerText = text;
            });

        return false;
    };
}

document.addEventListener("DOMContentLoaded", main);