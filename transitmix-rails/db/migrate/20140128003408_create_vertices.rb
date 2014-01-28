class CreateVertices < ActiveRecord::Migration
  def change
  	enable_extension :postgis

    create_table :vertices do |t|
      t.decimal :latitude, precision: "9", scale: "6"
      t.decimal :longitude, precision: "9", scale: "6"
      t.integer :route_id

      t.timestamps
    end
  end
end
