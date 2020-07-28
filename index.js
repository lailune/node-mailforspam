/**
 * Mail for spam node module
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const MAILFORSPAM_BASE = 'https://www.mailforspam.com/mail';

module.exports = class Mailforspam {

    /**
     * Mailforspam node module
     * @param {string} account Mail for spam account
     * @param {object} options Reserved for future
     */
    constructor(account, options = {}) {
        this.options = options;
        this.account = account;
    }


    /**
     * Change current account
     * @param {string} account
     */
    changeAccount(account) {
        this.account = account;
    }

    /**
     * Get emails list from selected page
     * @param {number} page
     * @returns {Promise<[]>}
     */
    async list(page = 1) {
        let checkAccount = this.account;
        if(page > 1) {
            checkAccount = checkAccount + '_' + page;
        }

        //Request selected page
        let body = await (await fetch(`${MAILFORSPAM_BASE}/${checkAccount}`)).text();

        let $ = cheerio.load(body);

        //Get all elements in table
        let table = $('#mailbox').find('tr');
        let emails = [];

        table.each((i, tr) => {
            tr = $(tr);

            let tds = tr.find('td');

            let email = {
                from: entities.decode($(tds[0]).text()).trim(),
                url: $(tds[1]).find('a').attr('href'),
                subject: entities.decode($(tds[1]).text()).trim(),
                date: entities.decode($(tds[2]).text()).trim(),
            };

            if(email.url) {
                email.id = email.url.split('/')[3];
                emails.push(email);
            }
        });

        return emails;
    }

    /**
     * Load email
     * @param {number|string} id
     * @returns {Promise<jQuery|HTMLElement>}
     * @private
     */
    async _read(id) {
        let body = await (await fetch(`${MAILFORSPAM_BASE}/${this.account}/${id}`)).text();
        let $ = cheerio.load(body);

        return $('#messagebody');
    }

    /**
     * Read email in selected format
     * @param {number|string} id Email id
     * @param {string} format HTML|TEXT
     * @returns {Promise<string>}
     */
    async read(id, format = 'html') {
        format = format.toLowerCase().trim();
        switch (format) {
            case 'text':
                return (await this._read(id)).text().trim();
            case "html":
            default:
                return (await this._read(id)).html().trim();
        }
    }

}