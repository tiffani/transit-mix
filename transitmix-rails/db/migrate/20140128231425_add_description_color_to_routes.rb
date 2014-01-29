class AddDescriptionColorToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :description, :string
    add_column :routes, :color, :string
  end
end
