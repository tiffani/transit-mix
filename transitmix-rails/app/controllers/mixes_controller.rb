class MixesController < ApplicationController
  protect_from_forgery with: :null_session
  
  def edit
  end

  def show
  end
  def update
  end

  def destroy
  end

  def new
  end

  def create
    @mix = Mix.create(name: params[:name])
  end

  def index
    @mixes = Mix.all
  end

  def show
    @mix = Mix.find(params[:id])
  end
end