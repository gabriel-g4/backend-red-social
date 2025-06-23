import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Post, PostDocument } from "./schemas/post.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { GetPostsDto, SortBy } from "./dto/get-posts.dto";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        private authService: AuthService
    ) {}

    async create(createPostDto: CreatePostDto, UserId: string, imagenPath?: string) : Promise<Post> {
        const finalImagenUrl = imagenPath || createPostDto.imagenUrl;
        const newPost = new this.postModel({
            ...createPostDto,
            autor: UserId,
            imagenUrl: finalImagenUrl,
            likes: []
        })

        return newPost.save();
    }

    async findAll(getPostDto: GetPostsDto): Promise <{posts: Post[], total: number}>{
        const { sortBy, usuarioId, offset = 0, limit = 10} = getPostDto;

        // consulta base - excluir publicaciones eliminadas
        const query = this.postModel.find({eliminado: false})

        // filtrar por usuario si se especifica
        if (usuarioId) {
            if (!Types.ObjectId.isValid(usuarioId)){
                throw new NotFoundException('Id de usuario invalido')
            }
            query.where('autor').equals(usuarioId)
        }

        // Ordenar por fecha o cantidad de likes
        if (sortBy === SortBy.LIKES) {
            query.sort({'likes.length': -1, 'createdAt': -1})
        } else if ( sortBy === SortBy.DATE) {
            query.sort({'createdAt': -1})
        }

        // Aplicar paginacion
        query.skip(offset).limit(limit)

        // Poblar la informacion del autor sin incluir informacion sensible
        query.populate('autor', 'username nombre apellido imagenPerfil')
        // query.populate('autor', '_id')  

        // ejecutar la consulta
        const posts =  await query.exec()

        // obtener conteo total de paginacion
        const total = await this.postModel.countDocuments({ eliminado: false, ...(usuarioId ? {autor: usuarioId} : {} )})

        return {posts, total};
    }

    async findOne(id: string): Promise <Post> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Id de post invalido')
        }

        const post = await this.postModel.findOne({
            _id:id,
            eliminado: false
        })
        .populate('autor', 'username nombre apellido imagenPerfil')


        if (!post) {
            throw new NotFoundException('Post no encontrado')
        }

        return post
    }

    async softDelete(id: string, usuarioId: string): Promise<Post> {
        console.log(`id: ${id}\nusuarioId: ${usuarioId}`)
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException("Id de post invalido")
        }

        const post = await this.findOne(id);

        // verificar si el usuario es el autor o un administrador
        const user = await this.authService.findById(usuarioId);
        console.log(user)
        const isAdmin = user && user.tipoPerfil && user.tipoPerfil.includes('admin') ? true : false;
        const isAutor = post.autor && post.autor.toString().includes(usuarioId) ? true : false;
        console.log(post)
        console.log(post.autor)
        console.log(`isadmin: ${isAdmin} isautor: ${isAutor}`)

        if (!isAdmin && !isAutor) {
            throw new ForbiddenException('No tiene permisos para eliminar la publicacion')
        }

        const updatePost = await this.postModel.findByIdAndUpdate(
            id,
            {eliminado: true},
            {new: true}
        ).exec()

        if (!updatePost) {
            throw new NotFoundException("No se pudo encontrar la publicacion para actualizar")
        }

        return updatePost;
    }

    async addLike(postId: string, usuarioId: string) : Promise<Post> {
        if (!Types.ObjectId.isValid(postId)) {
            throw new NotFoundException("Id de post invalido")
        }

        const post = await this.findOne(postId)

        // verificar si el usuario ya le dio like a la publicacion
        if (post.likes && post.likes.some(like => like?.toString() === usuarioId)) {
            throw new ForbiddenException('Ya has dado me gusta a esta publicacion')
        }

        const updatePost = await this.postModel.findByIdAndUpdate(
            postId,
            {$push: {likes: usuarioId}},
            {new: true}
        ).exec()

        if (!updatePost) {
            throw new NotFoundException('No se pudo econtrar la publicacion para actualizar')
        }

        return updatePost;
    }

    async removeLike(postId: string, usuarioId: string) : Promise<Post> {
        if (!Types.ObjectId.isValid(postId)) {
            throw new NotFoundException("Id de post invalido")
        }

        const post = await this.findOne(postId);

        // verificar si el usuario ya le dio like a la publicacion
        if (!post.likes || !post.likes.some(like => like?.toString() === usuarioId)) {
            throw new ForbiddenException('No has dado me gusta a esta publicacion')
        }

        const updatePost = await this.postModel.findByIdAndUpdate(
            postId,
            {$pull: {likes: usuarioId}},
            {new: true}
        ).exec();

        if (!updatePost) {
            throw new NotFoundException("No se pudo encontrar la publicacion para actualizar")
        }

        return updatePost
    }
}