describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Airica Fae',
      username: 'airicafae',
      password: 'afsekret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to blogs application')
    cy.get('.login-form')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"]').type('airicafae')
      cy.get('input[name="Password"]').type('afsekret')
      cy.get('.login-button').click()

      cy.get('html')
        .should('contain', 'Airica Fae logged-in')
        .and('contain', 'blogs')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"]').type('airicafae')
      cy.get('input[name="Password"]').type('wrong')
      cy.get('.login-button').click()

      cy.get('.notification')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'border-color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Airica Fae logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'airicafae', password: 'afsekret' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('input[name="title"]').type('Junie B. Jones')
      cy.get('input[name="author"]').type('Barbara Park')
      cy.get('input[name="url"]').type('junieb.com')
      cy.get('.submit-new-blog').click()

      cy.contains('Junie B. Jones Barbara Park')
    })

    describe('and several blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'first', url: 'first.com' })
        cy.createBlog({ title: 'second blog', author: 'second', url: 'second.com' })
        cy.createBlog({ title: 'third blog', author: 'third', url: 'third.com' })
      })

      it('the user can like one of those blogs', function () {
        cy.contains('second').parent().contains('likes 0')

        cy.contains('second').contains('view').click()

        cy.contains('second').parent().find('.like-btn').click()
        cy.contains('second').parent().find('.like-btn').click()

        cy.contains('second').parent().contains('likes 2')
      })

      it('a blog created by the user can be deleted', function() {
        cy.get('.blogs-list').should('have.length', 3)
        cy.contains('second').contains('view').click()

        cy.contains('second').parent().find('.delete-btn').click()
        cy.get('html').should('not.contain', 'second blog second')
        cy.get('.blogs-list').should('have.length', 2)
      })

      it('the blogs are ordered according to likes with the most likes being first', function() {
        cy.contains('second').contains('view').click()
        cy.contains('second').parent().find('.like-btn').click()
        cy.wait(2000)
        cy.contains('second').parent().find('.like-btn').click()
        cy.wait(2000)
        cy.contains('second').parent().find('.like-btn').click()
        cy.wait(2000)
        cy.contains('second').parent().find('.like-btn').click()
        cy.wait(2000)

        cy.contains('third').contains('view').click()
        cy.contains('third').parent().find('.like-btn').click()
        cy.contains('third').parent().find('.like-btn').click()

        cy.get('.blogs-list').eq(0).should('contain', 'second blog second')
        cy.get('.blogs-list').eq(1).should('contain', 'third blog third')
      })
    })
  })
})