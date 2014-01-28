class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|

      t.timestamps
    end
  end
end
