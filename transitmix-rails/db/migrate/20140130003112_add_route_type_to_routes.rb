class AddRouteTypeToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :routeType, :string
  end
end
