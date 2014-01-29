class MixesController < ApplicationController
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

  def index
    @mixes = Mix.all
  end

  def show
    @mix = Mix.first
  end
end
