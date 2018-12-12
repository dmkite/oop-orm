const knex = require('../db')

class Theatre {
    constructor({id, name, address}= {}){
        this._id = id
        this.name = name
        this.address = address
        this._removed = false
        this._valid = true
        if(!this.name || ! this.address) this._valid = false
    }

    get id(){
        return this._id
    }

    set id(val){
        throw new Error('Cannot change ID')
    }

    get removed(){
        return this._removed
    }

    set removed(val){
        if(val) throw new Error('Cannot change removed status')
        return this._removed = true
    }

    get valid(){
        return this._valid
    }

    set valid(newValidity){
        throw new Error('Cannot change validity')
    }
    static all(){
        return knex('theatres')
        .then(result => {
            const theatres = result.map(theatre => new Theatre(theatre))
            return theatres
        })
    }

    static find(id){
        return knex('theatres')
        .where('id', id)
        .first()
        .then(result => {
            return new Theatre(result)
        })
    }

    save(){
        if (!this.name || !this.address) return Promise.reject(new Error('Missing vital info'))
        if(!this.id){
            return knex('theatres')
            .insert({
                name: this.name,
                address: this.address
            })
            .returning('*')
            .then(([result]) => {
                this._id = result.id
                return this
            })
        }
        else{
            return knex('theatres')
            .where('id', this.id)
            .update({
                name: this.name,
                address: this.address
            })
            .then(() => this)
        }
    }

    destroy(){
        if(this.removed) return Promise.reject(new Error('This has already been deleted'))
        return knex('theatres')
        .where('id', this.id)
        .del()
        .then(result => {
            this._removed = true
            return this
        })
    }
}



module.exports = Theatre
