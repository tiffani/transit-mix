class AddAttributesToMixes < ActiveRecord::Migration
  def change
    add_column :mixes, :description, :string
    add_column :mixes, :name, :string
  end
end
