class AddNameToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :name, :string
  end
end
