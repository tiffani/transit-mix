class AddLatLngToRoutes < ActiveRecord::Migration
  def change
  	enable_extension :postgis

  	add_column :routes, :latitude,  :decimal, precision: "9", scale: "6"
  	add_column :routes, :longitude, :decimal, precision: "9", scale: "6"
  end
end
