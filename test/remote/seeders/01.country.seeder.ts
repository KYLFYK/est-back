import { Seeder } from "typeorm-seeding";
import CountrySeeder from "../../local/seeders/01.country.seeder";

export default class CountrySeederRemote extends CountrySeeder implements Seeder {}
  