import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article";

export default class ArticleRepository {

    public async getAllCount(){

    }

    public async getAll(){
        return (await Database.query().count('* as total'))[0].total;
    }
    public async getAllByAuthor(){

    }

}