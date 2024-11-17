terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.46.0"
    }
    
    dotenv = {
      source  = "jrhouston/dotenv"
      version = "~> 1.0"
    }
  }
}

data dotenv current {
  filename = "../backend/.env"
}

variable "zone_id" {
  default = "2e7930837dd10f92fca8aab02cf79159"
}

variable "account_id" {
  default = "1b64a8c4eff655773684dc27044290ac"
}

variable "domain" {
  default = "backtracc.tech"
}

variable "frontend_project_name" {
  default = "backtracc-frontend"
}

variable "frontend_production_branch" {
  default = "main"
}

resource "cloudflare_pages_project" "frontend" {
  account_id        = var.account_id
  name              = var.frontend_project_name
  production_branch = var.frontend_production_branch
  
  deployment_configs {
    preview {
      environment_variables = data.dotenv.current.env
    }
    production {
      environment_variables = data.dotenv.current.env
    }
  }
  
  build_config {
    root_dir            = "frontend"
    build_command       = "npm run build"
    destination_dir     = "dist"
  }
  
  source {
      type = "github"
      config {
        # NOTE(@jasonappah): deploying from a fork of the repo to address permissions issues, 
        # as my personal Cloudflare account is already linked to my personal GitHub
        # account and seems not to play nicely with deploying repos owned by other GitHub users.
        owner                         = "jasonappah"
        repo_name                     = "hackutd24"
        production_branch             = var.frontend_production_branch
        pr_comments_enabled           = true
        deployments_enabled           = true
        production_deployment_enabled = true
        preview_deployment_setting    = "custom"
        preview_branch_excludes       = [var.frontend_production_branch]
      }
    }
}

resource "cloudflare_pages_domain" "frontend_domain" {
  account_id   = var.account_id
  project_name = var.frontend_project_name
  domain       = var.domain
}

resource "cloudflare_record" "frontend_domain_record" {
  zone_id = var.zone_id
  name    = var.domain
  content   = "${var.frontend_project_name}.pages.dev"
  type    = "CNAME"
  proxied = true
}
