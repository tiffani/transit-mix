class AddMixIdToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :mix_id, :integer
  end
end
